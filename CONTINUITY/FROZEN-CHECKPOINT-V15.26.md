# FROZEN CHECKPOINT — V15.26

## Correções
- Clique de alvo agora é tratado diretamente pelo controlador da Mesa quando há uma ação pendente.
- Durante seleção de alvo, mover/redimensionar/rotacionar tokens fica bloqueado.
- Corrigido bug crítico em que soltar o handle de resize/rotate removia o elemento DOM do token (`done.node.remove()`), fazendo o personagem sumir visualmente.
- Clique em alvo inválido agora mostra feedback explícito em vez de não fazer nada.
- Handles de transformação ficam ocultos enquanto uma ação aguarda alvo.

Nenhuma migration nova. Mantém a migration v11 da V15.25.
