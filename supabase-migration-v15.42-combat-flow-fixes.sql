-- ============================================================
-- EDF V15.42 - sincronizacao, combate, efeitos e turnos (consolidada)
-- Substitui a V15.40. Aplicar sobre uma base V15.35/V15.38/V15.39 ou sobre a V15.40 ja instalada.
-- ============================================================
BEGIN;

-- ---------- Realtime: garante que as tabelas usadas pela UI publiquem mudanças ----------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['tabletop_entities','battles','battle_enemies','battle_effects','battle_log','battle_action_requests','characters'] LOOP
    IF to_regclass('public.'||t) IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename=t) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I',t);
    END IF;
  END LOOP;
END $$;

-- ---------- Efeitos visiveis para jogadores durante uma batalha ativa ----------
CREATE OR REPLACE FUNCTION public.get_battle_effects_v1542(p_battle_id uuid)
RETURNS SETOF public.battle_effects
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Usuario nao autenticado'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.battles b WHERE b.id=p_battle_id AND (COALESCE(b.active,true) OR EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=auth.uid() AND p.role='admin'))) THEN RAISE EXCEPTION 'Batalha indisponivel'; END IF;
  RETURN QUERY SELECT e.* FROM public.battle_effects e WHERE e.battle_id=p_battle_id ORDER BY e.created_at;
END $$;
REVOKE ALL ON FUNCTION public.get_battle_effects_v1542(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_battle_effects_v1542(uuid) TO authenticated;

-- ---------- Histórico legível por jogadores durante uma batalha ativa ----------
CREATE OR REPLACE FUNCTION public.get_battle_log_v1542(p_battle_id uuid)
RETURNS SETOF public.battle_log
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Usuario nao autenticado'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.battles b WHERE b.id=p_battle_id AND (COALESCE(b.active,true) OR EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=auth.uid() AND p.role='admin'))) THEN
    RAISE EXCEPTION 'Batalha indisponivel';
  END IF;
  RETURN QUERY SELECT l.* FROM public.battle_log l WHERE l.battle_id=p_battle_id ORDER BY l.created_at DESC LIMIT 30;
END $$;
REVOKE ALL ON FUNCTION public.get_battle_log_v1542(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_battle_log_v1542(uuid) TO authenticated;

-- ---------- Consumo atomico de ação/PD; aceita estado antigo plano e novo aninhado ----------
CREATE OR REPLACE FUNCTION public.consume_combat_action_v1535(
  p_battle_id uuid,
  p_actor_type text,
  p_actor_id text,
  p_action_slot text,
  p_pd_cost numeric DEFAULT 0,
  p_is_counter boolean DEFAULT false,
  p_context jsonb DEFAULT '{}'::jsonb
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  v_uid uuid:=auth.uid(); v_admin boolean:=false; v_b public.battles%ROWTYPE;
  v_state jsonb; v_row jsonb; v_turn jsonb; v_key text; v_marker text; v_slot text:=lower(COALESCE(NULLIF(trim(p_action_slot),''),'standard'));
  v_round int; v_used int:=0; v_limit int:=1; v_cost int:=GREATEST(0,COALESCE(p_pd_cost,0)::int); v_before int:=0; v_after int:=0;
  v_counter jsonb;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Usuario nao autenticado'; END IF;
  SELECT EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=v_uid AND p.role='admin') INTO v_admin;
  IF p_actor_type NOT IN ('player','enemy') THEN RAISE EXCEPTION 'Tipo de ator invalido'; END IF;
  IF p_actor_type='player' AND NOT v_admin AND p_actor_id<>v_uid::text THEN RAISE EXCEPTION 'Voce nao pode usar a acao de outro personagem'; END IF;
  IF p_actor_type='enemy' AND NOT v_admin THEN RAISE EXCEPTION 'Somente o mestre controla inimigos'; END IF;
  SELECT * INTO v_b FROM public.battles WHERE id=p_battle_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Combate nao encontrado'; END IF;
  IF COALESCE(v_b.active,true)=false THEN RAISE EXCEPTION 'Combate encerrado'; END IF;
  v_round:=GREATEST(COALESCE(v_b.round,1),1); v_marker:=v_round::text||':'||COALESCE(v_b.turn_index,0)::text;
  v_state:=COALESCE(v_b.reaction_state,'{}'::jsonb); IF jsonb_typeof(v_state)<>'object' THEN v_state:='{}'::jsonb; END IF;
  IF NOT(v_state?'actors') THEN v_state:=jsonb_set(v_state,'{actors}','{}'::jsonb,true); END IF;
  v_key:=p_actor_type||':'||p_actor_id; v_row:=COALESCE(v_state#>ARRAY['actors',v_key],'{}'::jsonb);

  -- PD é gasto mesmo quando a Ressonância falha.
  IF p_actor_type='player' THEN
    SELECT COALESCE(c.energy_current,0) INTO v_before FROM public.characters c WHERE c.user_id::text=p_actor_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Ficha do personagem nao encontrada'; END IF;
    IF v_cost>v_before THEN RAISE EXCEPTION 'PD insuficiente: custo %, disponivel %',v_cost,v_before; END IF;
    v_after:=v_before-v_cost;
    IF v_cost>0 THEN UPDATE public.characters SET energy_current=v_after WHERE user_id::text=p_actor_id; END IF;
  END IF;

  IF COALESCE(p_is_counter,false) THEN
    IF COALESCE((v_row->>'reaction_round')::int,0)<>v_round OR v_row->'counter_available' IS NULL THEN RAISE EXCEPTION 'Janela de contra-ataque nao esta disponivel'; END IF;
    IF COALESCE((v_row->>'counter')::int,0)>=1 THEN RAISE EXCEPTION 'Contra-ataque desta rodada ja foi usado'; END IF;
    v_row:=jsonb_set(v_row,'{counter}','1'::jsonb,true);
    v_row:=jsonb_set(v_row,'{reaction}',to_jsonb(GREATEST(COALESCE((v_row->>'reaction')::int,0),1)),true);
    v_row:=jsonb_set(v_row,'{reaction_round}',to_jsonb(v_round),true);
    v_row:=v_row-'counter_available';
  ELSE
    IF v_slot IN ('standard','movement','light','free') THEN
      IF COALESCE(v_row->>'turn_marker','')<>v_marker THEN
        v_turn:=jsonb_build_object('standard',0,'movement',0,'light',0,'free',0);
        v_row:=v_row||jsonb_build_object('standard',0,'movement',0,'light',0,'free',0,'turn_marker',v_marker,'turn',v_turn);
      ELSE
        v_turn:=COALESCE(v_row->'turn',jsonb_build_object('standard',COALESCE((v_row->>'standard')::int,0),'movement',COALESCE((v_row->>'movement')::int,0),'light',COALESCE((v_row->>'light')::int,0),'free',COALESCE((v_row->>'free')::int,0)));
      END IF;
      v_limit:=CASE WHEN v_slot='free' THEN 2 ELSE 1 END;
      v_used:=COALESCE((v_turn->>v_slot)::int,COALESCE((v_row->>v_slot)::int,0));
      IF v_used>=v_limit THEN RAISE EXCEPTION 'Esta acao ja foi usada neste turno: %',v_slot; END IF;
      v_turn:=jsonb_set(v_turn,ARRAY[v_slot],to_jsonb(v_used+1),true);
      v_row:=jsonb_set(v_row,ARRAY[v_slot],to_jsonb(v_used+1),true);
      v_row:=jsonb_set(v_row,'{turn}',v_turn,true); v_row:=jsonb_set(v_row,'{turn_marker}',to_jsonb(v_marker),true);
    ELSIF v_slot='reaction' THEN
      v_used:=CASE WHEN COALESCE((v_row->>'reaction_round')::int,0)=v_round THEN COALESCE((v_row->>'reaction')::int,0) ELSE 0 END;
      IF v_used>=1 THEN RAISE EXCEPTION 'A Reacao desta rodada ja foi usada'; END IF;
      v_row:=jsonb_set(v_row,'{reaction}',to_jsonb(v_used+1),true); v_row:=jsonb_set(v_row,'{reaction_round}',to_jsonb(v_round),true);
    ELSE
      RAISE EXCEPTION 'Tipo de acao invalido: %',v_slot;
    END IF;
  END IF;

  v_state:=jsonb_set(v_state,ARRAY['actors',v_key],v_row,true);
  UPDATE public.battles SET reaction_state=v_state WHERE id=p_battle_id;
  RETURN jsonb_build_object('ok',true,'pd_before',v_before,'pd_after',v_after,'reaction_state',v_state,'context',COALESCE(p_context,'{}'::jsonb));
END $$;
REVOKE ALL ON FUNCTION public.consume_combat_action_v1535(uuid,text,text,text,numeric,boolean,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_combat_action_v1535(uuid,text,text,text,numeric,boolean,jsonb) TO authenticated;

-- ---------- Contra-ataque persistente entre navegadores ----------
CREATE OR REPLACE FUNCTION public.set_counter_window_v1540(p_battle_id uuid,p_actor_type text,p_actor_id text,p_target_id text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_uid uuid:=auth.uid(); v_admin boolean; v_b public.battles%ROWTYPE; v_state jsonb; v_row jsonb; v_key text; v_round int;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Usuario nao autenticado'; END IF;
  SELECT EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=v_uid AND p.role='admin') INTO v_admin;
  IF p_actor_type='player' AND NOT v_admin AND p_actor_id<>v_uid::text THEN RAISE EXCEPTION 'Janela de outro jogador'; END IF;
  IF p_actor_type='enemy' AND NOT v_admin THEN RAISE EXCEPTION 'Somente o mestre'; END IF;
  SELECT * INTO v_b FROM public.battles WHERE id=p_battle_id FOR UPDATE; IF NOT FOUND THEN RAISE EXCEPTION 'Combate nao encontrado'; END IF;
  v_round:=GREATEST(COALESCE(v_b.round,1),1); v_state:=COALESCE(v_b.reaction_state,'{}'::jsonb); IF NOT(v_state?'actors') THEN v_state:=jsonb_set(v_state,'{actors}','{}'::jsonb,true); END IF;
  v_key:=p_actor_type||':'||p_actor_id; v_row:=COALESCE(v_state#>ARRAY['actors',v_key],'{}'::jsonb);
  v_row:=jsonb_set(v_row,'{reaction}',to_jsonb(GREATEST(COALESCE((v_row->>'reaction')::int,0),1)),true);
  v_row:=jsonb_set(v_row,'{reaction_round}',to_jsonb(v_round),true);
  v_row:=jsonb_set(v_row,'{counter_available}',jsonb_build_object('target_id',p_target_id,'round',v_round),true);
  v_state:=jsonb_set(v_state,ARRAY['actors',v_key],v_row,true); UPDATE public.battles SET reaction_state=v_state WHERE id=p_battle_id;
  RETURN jsonb_build_object('ok',true,'reaction_state',v_state,'target_id',p_target_id);
END $$;
REVOKE ALL ON FUNCTION public.set_counter_window_v1540(uuid,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_counter_window_v1540(uuid,text,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.clear_counter_window_v1540(p_battle_id uuid,p_actor_type text,p_actor_id text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_uid uuid:=auth.uid(); v_admin boolean; v_b public.battles%ROWTYPE; v_state jsonb; v_row jsonb; v_key text;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Usuario nao autenticado'; END IF;
 SELECT EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=v_uid AND p.role='admin') INTO v_admin;
 IF p_actor_type='player' AND NOT v_admin AND p_actor_id<>v_uid::text THEN RAISE EXCEPTION 'Janela de outro jogador'; END IF;
 IF p_actor_type='enemy' AND NOT v_admin THEN RAISE EXCEPTION 'Somente o mestre'; END IF;
 SELECT * INTO v_b FROM public.battles WHERE id=p_battle_id FOR UPDATE; IF NOT FOUND THEN RETURN jsonb_build_object('ok',true); END IF;
 v_state:=COALESCE(v_b.reaction_state,'{}'::jsonb); v_key:=p_actor_type||':'||p_actor_id; v_row:=COALESCE(v_state#>ARRAY['actors',v_key],'{}'::jsonb)-'counter_available';
 v_state:=jsonb_set(v_state,ARRAY['actors',v_key],v_row,true); UPDATE public.battles SET reaction_state=v_state WHERE id=p_battle_id;
 RETURN jsonb_build_object('ok',true,'reaction_state',v_state);
END $$;
REVOKE ALL ON FUNCTION public.clear_counter_window_v1540(uuid,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.clear_counter_window_v1540(uuid,text,text) TO authenticated;

-- ---------- Efeitos estruturados de habilidade (Encharcado, buffs, debuffs etc.) ----------
CREATE OR REPLACE FUNCTION public.apply_action_effects_v1540(p_battle_id uuid,p_actor_type text,p_actor_id text,p_target_type text,p_target_id text,p_effects jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_uid uuid:=auth.uid(); v_admin boolean; e jsonb; n int:=0;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Usuario nao autenticado'; END IF;
 SELECT EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=v_uid AND p.role='admin') INTO v_admin;
 IF p_actor_type='player' AND NOT v_admin AND p_actor_id<>v_uid::text THEN RAISE EXCEPTION 'Ator invalido'; END IF;
 IF p_actor_type='enemy' AND NOT v_admin THEN RAISE EXCEPTION 'Somente o mestre controla inimigos'; END IF;
 IF p_target_type NOT IN('player','enemy') THEN RAISE EXCEPTION 'Alvo invalido'; END IF;
 FOR e IN SELECT value FROM jsonb_array_elements(CASE WHEN jsonb_typeof(COALESCE(p_effects,'[]'::jsonb))='array' THEN COALESCE(p_effects,'[]'::jsonb) ELSE '[]'::jsonb END) LOOP
   IF COALESCE(trim(e->>'name'),'')<>'' THEN
     PERFORM public.apply_battle_effect_v1535(p_battle_id,p_target_type,p_target_id,e->>'name',GREATEST(COALESCE((e->>'rounds')::int,0),0),v_uid); n:=n+1;
   END IF;
 END LOOP;
 RETURN jsonb_build_object('ok',true,'applied',n);
END $$;
REVOKE ALL ON FUNCTION public.apply_action_effects_v1540(uuid,text,text,text,text,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.apply_action_effects_v1540(uuid,text,text,text,text,jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.apply_reaction_effects_v1540(p_request_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_uid uuid:=auth.uid(); v_admin boolean; r public.battle_action_requests%ROWTYPE; p jsonb; fx jsonb; e jsonb; target_type text; target_id text; n int:=0;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Usuario nao autenticado'; END IF;
 SELECT EXISTS(SELECT 1 FROM public.profiles x WHERE x.id=v_uid AND x.role='admin') INTO v_admin;
 SELECT * INTO r FROM public.battle_action_requests WHERE id=p_request_id; IF NOT FOUND THEN RAISE EXCEPTION 'Solicitacao nao encontrada'; END IF;
 IF NOT v_admin AND r.user_id<>v_uid THEN RAISE EXCEPTION 'Solicitacao de outro usuario'; END IF;
 p:=COALESCE(r.payload,'{}'::jsonb); fx:=COALESCE(p->'p_effects',p->'apply_payload'->'p_effects','[]'::jsonb);
 target_type:=COALESCE(p->>'target_type',p->'apply_payload'->>'p_target_type'); target_id:=COALESCE(p->>'target_id',p->'apply_payload'->>'p_target_id');
 -- V15.40: um ataque que nao acertou nunca aplica efeitos "on hit".
 IF COALESCE((p->>'hit_confirmed')::boolean,true)=false THEN RETURN jsonb_build_object('ok',true,'applied',0,'skipped','miss'); END IF;
 IF target_type NOT IN('player','enemy') OR COALESCE(target_id,'')='' THEN RETURN jsonb_build_object('ok',true,'applied',0); END IF;
 FOR e IN SELECT value FROM jsonb_array_elements(CASE WHEN jsonb_typeof(fx)='array' THEN fx ELSE '[]'::jsonb END) LOOP
   IF COALESCE(trim(e->>'name'),'')<>'' THEN PERFORM public.apply_battle_effect_v1535(r.battle_id,target_type,target_id,e->>'name',GREATEST(COALESCE((e->>'rounds')::int,0),0),v_uid); n:=n+1; END IF;
 END LOOP;
 RETURN jsonb_build_object('ok',true,'applied',n);
END $$;
REVOKE ALL ON FUNCTION public.apply_reaction_effects_v1540(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.apply_reaction_effects_v1540(uuid) TO authenticated;

-- ---------- Jogador pode terminar somente o proprio turno ----------
CREATE OR REPLACE FUNCTION public.finish_turn_v1542(p_battle_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_uid uuid:=auth.uid(); v_admin boolean; v_b public.battles%ROWTYPE; v_order jsonb; v_len int; v_i int; v_next int; v_round int; v_actor jsonb; v_label text; v_wrapped boolean:=false; v_expired int:=0;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Usuario nao autenticado'; END IF;
 SELECT EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=v_uid AND p.role='admin') INTO v_admin;
 SELECT * INTO v_b FROM public.battles WHERE id=p_battle_id FOR UPDATE; IF NOT FOUND THEN RAISE EXCEPTION 'Combate nao encontrado'; END IF;
 v_order:=COALESCE(to_jsonb(v_b.turn_order),'[]'::jsonb); v_len:=jsonb_array_length(v_order); IF v_len=0 THEN RAISE EXCEPTION 'Iniciativa vazia'; END IF;
 v_i:=GREATEST(0,LEAST(v_len-1,COALESCE(v_b.turn_index,0))); v_actor:=v_order->v_i;
 IF NOT v_admin AND NOT(COALESCE(v_actor->>'type','')='player' AND COALESCE(v_actor->>'id','')=v_uid::text) THEN RAISE EXCEPTION 'Nao e seu turno'; END IF;
 IF EXISTS(SELECT 1 FROM public.battle_action_requests q WHERE q.battle_id=p_battle_id AND q.status='pending') THEN RAISE EXCEPTION 'Existe uma reacao pendente'; END IF;
 v_next:=v_i+1; v_round:=GREATEST(COALESCE(v_b.round,1),1);
 IF v_next>=v_len THEN
   v_next:=0; v_round:=v_round+1; v_wrapped:=true;
   SELECT count(*) INTO v_expired FROM public.battle_effects e WHERE e.battle_id=p_battle_id AND e.rounds_remaining=1;
   DELETE FROM public.battle_effects e WHERE e.battle_id=p_battle_id AND e.rounds_remaining=1;
   UPDATE public.battle_effects e SET rounds_remaining=e.rounds_remaining-1 WHERE e.battle_id=p_battle_id AND e.rounds_remaining>1;
 END IF;
 v_label:=COALESCE(v_order->v_next->>'label','Turno'); UPDATE public.battles SET turn_index=v_next,turn_label=v_label,round=v_round WHERE id=p_battle_id;
 RETURN jsonb_build_object('ok',true,'turn_index',v_next,'turn_label',v_label,'round',v_round,'wrapped',v_wrapped,'expired_effects',v_expired);
END $$;
REVOKE ALL ON FUNCTION public.finish_turn_v1542(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.finish_turn_v1542(uuid) TO authenticated;

-- ---------- Begin action usa a economia/PD acima e cria a reação ----------
CREATE OR REPLACE FUNCTION public.begin_combat_action_v1535(
  p_battle_id uuid,p_actor_type text,p_actor_id text,p_target_type text,p_target_id text,p_action_name text,p_action_kind text,
  p_attack_result numeric,p_damage numeric,p_action_slot text,p_pd_cost numeric,p_is_counter boolean,p_context jsonb,p_apply_payload jsonb
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  spent jsonb; v_uid uuid:=auth.uid(); v_admin boolean; v_request_user uuid; v_request_id uuid; v_payload jsonb; v_status text;
  v_mode text:=lower(COALESCE(p_context->>'resolution_mode','automatic')); v_hit boolean:=true; v_target_defense numeric:=NULL; v_context_defense numeric:=NULL; v_db_defense numeric:=NULL; v_existing_request uuid;
  v_b public.battles%ROWTYPE; v_state jsonb; v_row jsonb; v_key text; v_round int; v_reaction_used int:=0;
BEGIN
 IF v_uid IS NULL THEN RAISE EXCEPTION 'Usuario nao autenticado'; END IF;
 SELECT EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=v_uid AND p.role='admin') INTO v_admin;
 IF p_target_type NOT IN('player','enemy') THEN RAISE EXCEPTION 'Alvo invalido'; END IF;
 -- V15.42: retry idempotente. A mesma acao pendente e reutilizada sem novo gasto de acao/PD.
 SELECT q.id INTO v_existing_request FROM public.battle_action_requests q
 WHERE q.battle_id=p_battle_id AND q.status='pending'
   AND COALESCE(q.payload->>'actor_type','')=p_actor_type AND COALESCE(q.payload->>'actor_id','')=p_actor_id
   AND COALESCE(q.payload->>'target_type','')=p_target_type AND COALESCE(q.payload->>'target_id','')=p_target_id
   AND COALESCE(q.payload->>'action','')=COALESCE(NULLIF(p_action_name,''),'Acao')
 ORDER BY q.created_at DESC LIMIT 1;
 IF v_existing_request IS NOT NULL THEN
   RETURN jsonb_build_object('ok',true,'executed',true,'duplicate',true,'request_id',v_existing_request,'action',jsonb_build_object('request_id',v_existing_request,'cost_paid',true));
 END IF;
 spent:=public.consume_combat_action_v1535(p_battle_id,p_actor_type,p_actor_id,p_action_slot,p_pd_cost,p_is_counter,p_context);
 v_status:=COALESCE(p_context->>'resonance_status','not_required');
 IF COALESCE((p_context->>'resonance_required')::boolean,false) AND v_status<>'success' THEN
   RETURN jsonb_build_object('ok',true,'executed',false,'reason','resonance_failed','pd_before',spent->'pd_before','pd_after',spent->'pd_after','action',jsonb_build_object('reaction_state',spent->'reaction_state','pd_after',spent->'pd_after'));
 END IF;

 -- V15.40: "Miss = zero damage + zero on-hit effects".
 -- Weapon/precision precisam atingir a Defesa. Ressonancia corpo a corpo, area,
 -- resistencia e suporte seguem seus fluxos proprios e nao usam esta checagem generica.
 IF v_mode IN ('weapon','precision') THEN
   BEGIN v_context_defense:=NULLIF(p_context->>'target_defense','')::numeric; EXCEPTION WHEN others THEN v_context_defense:=NULL; END;
   IF p_target_type='enemy' THEN
     SELECT COALESCE(e.defense,0) INTO v_db_defense FROM public.battle_enemies e WHERE e.id::text=p_target_id AND e.battle_id=p_battle_id LIMIT 1;
   ELSE
     SELECT 5+COALESCE(c.constitution,0)+COALESCE(c.block,0) INTO v_db_defense FROM public.characters c WHERE c.user_id::text=p_target_id LIMIT 1;
   END IF;
   -- O cliente pode informar bonus derivados, mas nunca reduzir a Defesa basica persistida.
   v_target_defense:=GREATEST(COALESCE(v_db_defense,0),COALESCE(v_context_defense,0),0);
   v_hit:=COALESCE(p_attack_result,0)>=v_target_defense;
 END IF;

 IF NOT v_hit THEN
   -- Nao cria request de dano/reacao defensiva e nao carrega efeitos de acerto.
   -- Se o alvo ainda tem Reacao, persiste uma janela de Contra-Ataque por erro do agressor.
   SELECT * INTO v_b FROM public.battles WHERE id=p_battle_id FOR UPDATE;
   v_round:=GREATEST(COALESCE(v_b.round,1),1);
   v_state:=COALESCE(spent->'reaction_state',COALESCE(v_b.reaction_state,'{}'::jsonb));
   IF jsonb_typeof(v_state)<>'object' THEN v_state:='{}'::jsonb; END IF;
   IF NOT(v_state?'actors') THEN v_state:=jsonb_set(v_state,'{actors}','{}'::jsonb,true); END IF;
   v_key:=p_target_type||':'||p_target_id;
   v_row:=COALESCE(v_state#>ARRAY['actors',v_key],'{}'::jsonb);
   v_reaction_used:=CASE WHEN COALESCE((v_row->>'reaction_round')::int,0)=v_round THEN COALESCE((v_row->>'reaction')::int,0) ELSE 0 END;
   IF v_reaction_used<1 THEN
     v_row:=jsonb_set(v_row,'{reaction_round}',to_jsonb(v_round),true);
     v_row:=jsonb_set(v_row,'{counter_available}',jsonb_build_object('target_id',p_actor_id,'round',v_round,'reason','attack_missed'),true);
     v_state:=jsonb_set(v_state,ARRAY['actors',v_key],v_row,true);
     UPDATE public.battles SET reaction_state=v_state WHERE id=p_battle_id;
   END IF;
   RETURN jsonb_build_object(
     'ok',true,'executed',true,'missed',true,'hit_confirmed',false,'target_defense',v_target_defense,
     'damage_applied',0,'effects_applied',0,'pd_before',spent->'pd_before','pd_after',spent->'pd_after',
     'action',jsonb_build_object('reaction_state',v_state,'pd_after',spent->'pd_after','cost_paid',true)
   );
 END IF;

 IF p_actor_type='player' AND p_target_type='enemy' THEN SELECT p.id INTO v_request_user FROM public.profiles p WHERE p.role='admin' LIMIT 1;
 ELSIF p_actor_type='enemy' AND p_target_type='player' THEN v_request_user:=p_target_id::uuid;
 ELSE RAISE EXCEPTION 'Combinacao de ataque invalida'; END IF;
 IF v_request_user IS NULL THEN RAISE EXCEPTION 'Controlador da reacao nao encontrado'; END IF;
 v_payload:=COALESCE(p_apply_payload,'{}'::jsonb)||jsonb_build_object(
   'battle_id',p_battle_id,'actor_type',p_actor_type,'actor_id',p_actor_id,'target_type',p_target_type,'target_id',p_target_id,
   'action',COALESCE(NULLIF(p_action_name,''),'Acao'),'action_kind',COALESCE(NULLIF(p_action_kind,''),'action'),
   'attack_result',GREATEST(COALESCE(p_attack_result,0),0),'target_defense',v_target_defense,'hit_confirmed',true,
   'damage',GREATEST(COALESCE(p_damage,0),0),'action_slot',p_action_slot,'pd_cost',GREATEST(COALESCE(p_pd_cost,0),0),
   'is_counter',COALESCE(p_is_counter,false),'context',COALESCE(p_context,'{}'::jsonb)
 );
 INSERT INTO public.battle_action_requests(battle_id,user_id,message,payload,status)
 VALUES(p_battle_id,v_request_user,COALESCE(NULLIF(p_action_name,''),'Acao')||': aguardando reacao',v_payload,'pending') RETURNING id INTO v_request_id;
 RETURN jsonb_build_object('ok',true,'executed',true,'missed',false,'hit_confirmed',true,'target_defense',v_target_defense,'request_id',v_request_id,'pd_before',spent->'pd_before','pd_after',spent->'pd_after','action',jsonb_build_object('request_id',v_request_id,'reaction_state',spent->'reaction_state','pd_after',spent->'pd_after','cost_paid',true));
END $$;
REVOKE ALL ON FUNCTION public.begin_combat_action_v1535(uuid,text,text,text,text,text,text,numeric,numeric,text,numeric,boolean,jsonb,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.begin_combat_action_v1535(uuid,text,text,text,text,text,text,numeric,numeric,text,numeric,boolean,jsonb,jsonb) TO authenticated;

NOTIFY pgrst,'reload schema';
COMMIT;
