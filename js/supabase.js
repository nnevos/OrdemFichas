// Configuracao da instalacao separada. NUNCA reutilize o banco de Elemento do Frio.
// A interface nova de Ordem Paranormal funciona sem este arquivo, usando armazenamento local.
// Para habilitar a interface legada, forneca window.ORDEM_SUPABASE_CONFIG no arquivo
// ordem-config.js (nao versionado) antes deste script.
const __config = window.ORDEM_SUPABASE_CONFIG || null;
const supabaseUrl = __config?.url || '';
const supabaseKey = __config?.anonKey || '';
const supabaseClient = (window.supabase && /^https:\/\//.test(supabaseUrl) && supabaseKey)
  ? window.supabase.createClient(supabaseUrl, supabaseKey)
  : null;
if (!supabaseClient) console.warn('Supabase desativado: use configuracao independente antes de iniciar a interface legada.');
