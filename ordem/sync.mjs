// Optional shared storage. Public collaborative campaigns: NO login, NO confidentiality.
export async function createSharedStore(config, onRemoteChange, onStatus) {
  if (!config?.url || !config?.anonKey || config.url.includes('SEU_PROJETO')) return null;
  const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  const client=createClient(config.url,config.anonKey,{auth:{persistSession:false,autoRefreshToken:false},realtime:{params:{eventsPerSecond:10}}});
  const assert=({data,error})=>{if(error)throw error;return data};
  let channel;
  const store={
    async load(){
      const [campaigns,characters]=await Promise.all([
        client.from('ordem_campaigns').select('id,name,created_at').order('created_at',{ascending:true}),
        client.from('ordem_characters').select('id,campaign_id,sheet,updated_at')
      ]);
      return {campaigns:assert(campaigns).map(x=>({id:x.id,name:x.name})),characters:assert(characters).map(x=>({...x.sheet,id:x.id,campaignId:x.campaign_id,lastEdited:x.updated_at}))};
    },
    async saveCampaign(c){assert(await client.from('ordem_campaigns').upsert({id:c.id,name:c.name},{onConflict:'id'}));},
    async deleteCampaign(id){assert(await client.from('ordem_campaigns').delete().eq('id',id));},
    async saveCharacter(c){assert(await client.from('ordem_characters').upsert({id:c.id,campaign_id:c.campaignId,title:c.name||'Agente',sheet:c,updated_at:new Date().toISOString()},{onConflict:'id'}));},
    async deleteCharacter(id){assert(await client.from('ordem_characters').delete().eq('id',id));},
    subscribe(){channel=client.channel('ordem-public-sync').on('postgres_changes',{event:'*',schema:'public',table:'ordem_campaigns'},onRemoteChange).on('postgres_changes',{event:'*',schema:'public',table:'ordem_characters'},onRemoteChange).subscribe(status=>{if(status==='SUBSCRIBED')onStatus?.('Conectado · sincronização ao vivo');if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')onStatus?.('Conexão instável · confira o Supabase')});},
    dispose(){if(channel)client.removeChannel(channel)}
  };
  return store;
}
