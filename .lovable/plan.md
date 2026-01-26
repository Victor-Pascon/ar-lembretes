

## Plano de Melhorias para Criacao de Lembretes com QR Code

### Objetivo

Aprimorar a experiencia de criacao de lembretes adicionando:
1. Preview em tempo real do QR Code durante a criacao
2. Mensagem informativa sobre a imutabilidade do QR Code
3. Layout mais amplo e visual melhorado

---

### Visao Geral das Mudancas

O formulario atual (`ReminderFormDialog.tsx`) sera expandido para incluir uma secao lateral de preview do QR Code e uma mensagem destacada sobre a permanencia do codigo.

```text
+----------------------------------------------------------+
|                  Criar Novo Lembrete                      |
+----------------------------------------------------------+
|                                                           |
|  +----------------------+    +-----------------------+    |
|  | FORMULARIO           |    | PREVIEW QR CODE       |    |
|  |                      |    |                       |    |
|  | Nome do lembrete     |    |     +----------+      |    |
|  | [________________]   |    |     |   QR     |      |    |
|  |                      |    |     |  Code    |      |    |
|  | Local fisico         |    |     | Preview  |      |    |
|  | [______v______][+]   |    |     +----------+      |    |
|  |                      |    |                       |    |
|  | Mensagem AR          |    |  Seu QR Code unico    |    |
|  | [                ]   |    |  sera gerado aqui     |    |
|  | [________________]   |    |                       |    |
|  |                      |    +-----------------------+    |
|  | [Switch] Ativo       |                                 |
|  +----------------------+                                 |
|                                                           |
|  +------------------------------------------------------+ |
|  | (i) IMPORTANTE: O QR Code gerado sera UNICO e        | |
|  |     PERMANENTE. Apos criado, voce podera alterar     | |
|  |     apenas a mensagem exibida, nunca o codigo.       | |
|  +------------------------------------------------------+ |
|                                                           |
|              [Cancelar]  [Criar Lembrete]                 |
+----------------------------------------------------------+
```

---

### Arquivos a Modificar

**1. `src/components/reminders/ReminderFormDialog.tsx`**

Principais alteracoes:
- Expandir largura do dialog para `sm:max-w-[700px]`
- Adicionar layout de duas colunas (formulario + preview)
- Integrar componente `QRCodeDisplay` com preview placeholder
- Adicionar mensagem informativa sobre imutabilidade
- Mostrar preview apenas no modo de criacao (nao edicao)

---

### Detalhes Tecnicos

**Preview do QR Code:**
- Gerar um UUID temporario para simular o preview
- Usar `useMemo` para manter o UUID consistente durante a sessao
- Mostrar QR Code com estilo padrao (roxo/branco)
- Texto explicativo abaixo: "Seu QR Code unico sera gerado ao criar o lembrete"

**Mensagem Informativa:**
- Usar componente `Alert` com variante customizada
- Icone de informacao (Info ou Lock)
- Estilo destacado com borda e fundo em tons de amarelo/ambar ou azul informativo
- Texto claro sobre a imutabilidade do QR Code

**Responsividade:**
- Desktop: Layout de duas colunas
- Mobile: Layout empilhado (preview acima do formulario)

---

### Codigo das Alteracoes

**ReminderFormDialog.tsx - Estrutura Atualizada:**

```typescript
// Novos imports
import { useMemo } from "react";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QRCodeDisplay } from "./QRCodeDisplay";

// Dentro do componente:
const previewQRData = useMemo(() => crypto.randomUUID(), []);

// No JSX - Dialog expandido:
<DialogContent className="sm:max-w-[700px]">
  {/* Header */}
  
  {/* Layout duas colunas */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Coluna do Formulario */}
    <div className="space-y-4">
      {/* Campos existentes */}
    </div>
    
    {/* Coluna do Preview - apenas criacao */}
    {!isEditing && (
      <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-xl border border-dashed">
        <QRCodeDisplay data={previewQRData} size={160} />
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Preview do seu QR Code
        </p>
      </div>
    )}
  </div>
  
  {/* Mensagem de imutabilidade - apenas criacao */}
  {!isEditing && (
    <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
      <Info className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        <strong>Importante:</strong> O QR Code gerado sera unico e permanente. 
        Apos criado, voce podera alterar apenas o conteudo da mensagem, 
        nunca o codigo em si.
      </AlertDescription>
    </Alert>
  )}
  
  {/* Footer com botoes */}
</DialogContent>
```

---

### Fluxo de Experiencia do Usuario

1. Usuario clica em "Criar novo lembrete"
2. Dialog abre com formulario a esquerda e preview do QR a direita
3. QR Code de preview e exibido imediatamente (UUID temporario)
4. Mensagem amarela destaca a importancia da permanencia do QR
5. Usuario preenche campos e clica em "Criar lembrete"
6. QR Code real e gerado e salvo no banco
7. Toast de sucesso confirma a criacao

---

### Vantagens da Implementacao

- **Clareza:** Usuario visualiza o QR Code antes de criar
- **Transparencia:** Mensagem informativa evita confusao futura
- **Consistencia:** Mantem o estilo visual do projeto
- **Simplicidade:** Alteracao minima em um unico arquivo
- **Responsividade:** Funciona bem em desktop e mobile

