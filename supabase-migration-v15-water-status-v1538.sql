-- V15.38 - consolidacao de status de Agua e automacoes de regras.
-- Requer que a migration V14 / V15.35 ja tenha sido aplicada anteriormente.
-- Este pacote contem apenas esta migration nova, conforme solicitado.

BEGIN;

CREATE OR REPLACE FUNCTION public.apply_battle_effect_v1535(
  p_battle_id uuid,
  p_entity_type text,
  p_entity_id text,
  p_name text,
  p_rounds integer DEFAULT 0,
  p_created_by uuid DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  v_name text:=trim(COALESCE(p_name,''));
  v_rounds integer:=GREATEST(COALESCE(p_rounds,0),0);
  v_existing public.battle_effects%ROWTYPE;
  v_other public.battle_effects%ROWTYPE;
  v_final text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Usuario nao autenticado'; END IF;
  IF p_entity_type NOT IN('player','enemy') THEN RAISE EXCEPTION 'Tipo de alvo invalido'; END IF;
  IF v_name='' THEN RETURN jsonb_build_object('ok',true,'ignored',true); END IF;

  -- Evolucoes consolidadas de Fogo/Frio e estado avancado de Agua (V15.38).
  IF lower(v_name)=lower('Em Chamas') THEN
    DELETE FROM public.battle_effects WHERE battle_id=p_battle_id AND entity_type=p_entity_type AND entity_id=p_entity_id AND lower(name)=lower('Queimando');
  END IF;
  IF lower(v_name)=lower('Congelado') THEN
    DELETE FROM public.battle_effects WHERE battle_id=p_battle_id AND entity_type=p_entity_type AND entity_id=p_entity_id AND lower(name) IN(lower('Resfriado'),lower('Congelando'));
  END IF;
  -- Agua: Saturado e um estado avancado explicitamente aplicado por habilidade.
  -- Reaplicar Encharcado sozinho NAO cria Saturado.
  IF lower(v_name)=lower('Saturado') THEN
    DELETE FROM public.battle_effects WHERE battle_id=p_battle_id AND entity_type=p_entity_type AND entity_id=p_entity_id AND lower(name)=lower('Encharcado');
  ELSIF lower(v_name)=lower('Encharcado') THEN
    SELECT * INTO v_other FROM public.battle_effects
      WHERE battle_id=p_battle_id AND entity_type=p_entity_type AND entity_id=p_entity_id AND lower(name)=lower('Saturado')
      ORDER BY created_at LIMIT 1 FOR UPDATE;
    IF FOUND THEN
      UPDATE public.battle_effects SET rounds_remaining=GREATEST(rounds_remaining,v_rounds) WHERE id=v_other.id;
      RETURN jsonb_build_object('ok',true,'refreshed',true,'name','Saturado','rounds',GREATEST(v_other.rounds_remaining,v_rounds));
    END IF;
  END IF;

  IF lower(v_name)=lower('Queimando') THEN
    SELECT * INTO v_existing FROM public.battle_effects
      WHERE battle_id=p_battle_id AND entity_type=p_entity_type AND entity_id=p_entity_id AND lower(name)=lower('Queimando')
      ORDER BY created_at LIMIT 1 FOR UPDATE;
    IF FOUND THEN
      UPDATE public.battle_effects SET name='Em Chamas', rounds_remaining=GREATEST(rounds_remaining,v_rounds,2) WHERE id=v_existing.id;
      RETURN jsonb_build_object('ok',true,'fusion',true,'name','Em Chamas');
    END IF;
  END IF;

  IF lower(v_name)=lower('Resfriado') THEN
    SELECT * INTO v_other FROM public.battle_effects
      WHERE battle_id=p_battle_id AND entity_type=p_entity_type AND entity_id=p_entity_id AND lower(name)=lower('Congelando')
      ORDER BY created_at LIMIT 1 FOR UPDATE;
    IF FOUND THEN
      UPDATE public.battle_effects SET name='Congelado', rounds_remaining=GREATEST(rounds_remaining,v_rounds,1) WHERE id=v_other.id;
      DELETE FROM public.battle_effects WHERE battle_id=p_battle_id AND entity_type=p_entity_type AND entity_id=p_entity_id AND lower(name)=lower('Resfriado');
      RETURN jsonb_build_object('ok',true,'fusion',true,'name','Congelado');
    END IF;
    SELECT * INTO v_existing FROM public.battle_effects
      WHERE battle_id=p_battle_id AND entity_type=p_entity_type AND entity_id=p_entity_id AND lower(name)=lower('Resfriado')
      ORDER BY created_at LIMIT 1 FOR UPDATE;
    IF FOUND THEN
      UPDATE public.battle_effects SET name='Congelando', rounds_remaining=GREATEST(rounds_remaining,v_rounds,1) WHERE id=v_existing.id;
      RETURN jsonb_build_object('ok',true,'fusion',true,'name','Congelando');
    END IF;
  END IF;

  IF lower(v_name)=lower('Congelando') THEN
    SELECT * INTO v_other FROM public.battle_effects
      WHERE battle_id=p_battle_id AND entity_type=p_entity_type AND entity_id=p_entity_id
        AND lower(name) IN(lower('Resfriado'),lower('Congelando'))
      ORDER BY CASE WHEN lower(name)=lower('Congelando') THEN 0 ELSE 1 END, created_at LIMIT 1 FOR UPDATE;
    IF FOUND THEN
      UPDATE public.battle_effects SET name='Congelado', rounds_remaining=GREATEST(rounds_remaining,v_rounds,1) WHERE id=v_other.id;
      DELETE FROM public.battle_effects WHERE battle_id=p_battle_id AND entity_type=p_entity_type AND entity_id=p_entity_id AND id<>v_other.id AND lower(name) IN(lower('Resfriado'),lower('Congelando'));
      RETURN jsonb_build_object('ok',true,'fusion',true,'name','Congelado');
    END IF;
  END IF;

  -- Status igual nao acumula: renova a maior duracao.
  SELECT * INTO v_existing FROM public.battle_effects
    WHERE battle_id=p_battle_id AND entity_type=p_entity_type AND entity_id=p_entity_id AND lower(name)=lower(v_name)
    ORDER BY created_at LIMIT 1 FOR UPDATE;
  IF FOUND THEN
    UPDATE public.battle_effects SET rounds_remaining=GREATEST(rounds_remaining,v_rounds) WHERE id=v_existing.id;
    RETURN jsonb_build_object('ok',true,'refreshed',true,'name',v_existing.name,'rounds',GREATEST(v_existing.rounds_remaining,v_rounds));
  END IF;

  INSERT INTO public.battle_effects(battle_id,entity_type,entity_id,name,rounds_remaining,created_by)
  VALUES(p_battle_id,p_entity_type,p_entity_id,v_name,v_rounds,COALESCE(p_created_by,auth.uid()));
  RETURN jsonb_build_object('ok',true,'created',true,'name',v_name,'rounds',v_rounds);
END; $$;
REVOKE EXECUTE ON FUNCTION public.apply_battle_effect_v1535(uuid,text,text,text,integer,uuid) FROM PUBLIC, authenticated;

CREATE OR REPLACE FUNCTION public.admin_apply_battle_effect_v1535(p_battle_id uuid,p_entity_type text,p_entity_id text,p_name text,p_rounds integer DEFAULT 0)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=auth.uid() AND p.role='admin') THEN RAISE EXCEPTION 'Somente o mestre pode aplicar efeitos manualmente'; END IF;
  RETURN public.apply_battle_effect_v1535(p_battle_id,p_entity_type,p_entity_id,p_name,p_rounds,auth.uid());
END;$$;
GRANT EXECUTE ON FUNCTION public.admin_apply_battle_effect_v1535(uuid,text,text,text,integer) TO authenticated;


COMMIT;
