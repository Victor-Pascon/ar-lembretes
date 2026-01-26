

## Tela de Personalizacao Visual Avancada de QR Code

### Analise do Estado Atual

O projeto ja possui um dialogo simples de personalizacao (`QRCodeCustomizerDialog.tsx`) que permite alterar cores do QR Code. A nova funcionalidade solicitada e significativamente mais avancada, permitindo:

- Upload de imagem base (cafeteira, parede, equipamento)
- Posicionamento do QR Code sobre a imagem via drag-and-drop
- Redimensionamento, rotacao e opacidade do QR Code
- Preview em tempo real
- Download da imagem final combinada

---

### Arquitetura da Solucao

```text
+-------------------------------------------------------------------------+
|                    Personalizacao Visual do QR Code                      |
+-------------------------------------------------------------------------+
| [Voltar]                                              [Baixar] [Salvar] |
+-------------------------------------------------------------------------+
|                                                                          |
|  +-------------------------------------------+  +----------------------+ |
|  |                                           |  | CONTROLES            | |
|  |           CANVAS DE EDICAO                |  |                      | |
|  |                                           |  | Tamanho              | |
|  |    +----------------+                     |  | [=======O====]       | |
|  |    | Imagem Base    |                     |  |                      | |
|  |    |                |                     |  | Opacidade            | |
|  |    |   +------+     |                     |  | [=======O====]       | |
|  |    |   | QR   |<--- Arrastavel           |  |                      | |
|  |    |   | Code |     Redimensionavel      |  | Rotacao              | |
|  |    |   +------+     |                     |  | [=======O====]       | |
|  |    |                |                     |  |                      | |
|  |    +----------------+                     |  | Imagem Base          | |
|  |                                           |  | [Upload] [Templates] | |
|  +-------------------------------------------+  |                      | |
|                                                  | +------------------+ | |
|  +----------------------------------------------+ | | Preview Final  | | |
|  | (i) AVISO: O QR Code e permanente.           | | |                | | |
|  |     Apenas sua posicao visual pode mudar.    | | +------------------+ | |
|  +----------------------------------------------+ +----------------------+ |
+-------------------------------------------------------------------------+
```

---

### Estrutura de Arquivos

**Novos arquivos a criar:**

```text
src/
  components/
    reminders/
      QRCodeVisualEditor.tsx       # Componente principal de edicao visual
      QRCodeCanvas.tsx             # Canvas com drag-and-drop do QR
      QRCodeControls.tsx           # Sliders e controles de personalizacao
      QRCodeImageUpload.tsx        # Upload de imagem base
  pages/
    QRCodeEditor.tsx               # Pagina dedicada para edicao visual
```

---

### Detalhes Tecnicos

**1. Estado da Personalizacao Visual (tipo expandido):**

```typescript
interface QRVisualConfig {
  // Configuracao basica de cores (existente)
  foreground: string;
  background: string;
  
  // Nova configuracao visual
  position: { x: number; y: number };  // Posicao do QR na imagem
  size: number;                         // Tamanho em pixels
  rotation: number;                     // Graus (0-360)
  opacity: number;                      // 0-1
  baseImageUrl?: string;                // URL da imagem base (storage)
}
```

**2. Canvas de Edicao (QRCodeCanvas.tsx):**

- Utiliza HTML Canvas API para renderizacao
- Implementa drag-and-drop nativo com mouse events
- Handles de redimensionamento nos cantos do QR
- Preview em tempo real durante manipulacao

**3. Controles de Personalizacao (QRCodeControls.tsx):**

- Slider para tamanho (50px - 300px)
- Slider para opacidade (0% - 100%)
- Slider para rotacao (0 - 360 graus)
- Botao de upload com preview
- Templates pre-definidos de imagens

**4. Geracao da Imagem Final:**

- Combina imagem base + QR Code no canvas
- Exporta como PNG/JPEG para download
- Salva configuracao visual no banco (qr_code_style)

---

### Integracao com Storage

Para armazenar imagens base personalizadas, utilizaremos o bucket existente `avatars` ou criaremos um novo bucket `qr-backgrounds`:

```sql
-- Criar bucket para backgrounds de QR (se necessario)
INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-backgrounds', 'qr-backgrounds', true);
```

---

### Fluxo de Dados

```text
1. Usuario abre editor visual para um lembrete
      |
2. Carrega configuracao existente (qr_code_style)
      |
3. Usuario faz upload de imagem base
      |
      +--> Imagem salva no Storage
      |
4. Usuario arrasta e posiciona QR Code
      |
5. Usuario ajusta tamanho/opacidade/rotacao
      |
6. Preview atualiza em tempo real
      |
7. Usuario clica "Salvar"
      |
      +--> Atualiza qr_code_style no banco
      |
8. Usuario clica "Baixar"
      |
      +--> Canvas exporta imagem PNG
```

---

### Rotas Atualizadas

```tsx
// App.tsx
<Route path="/qr-editor/:reminderId" element={<QRCodeEditor />} />
```

---

### Componentes em Detalhe

**QRCodeVisualEditor.tsx (Componente Principal):**

```typescript
interface QRCodeVisualEditorProps {
  reminder: ReminderWithLocation;
  onSave: (config: QRVisualConfig) => Promise<void>;
  onBack: () => void;
}

// Estados:
// - config: QRVisualConfig (posicao, tamanho, rotacao, opacidade)
// - baseImage: File | null (imagem carregada)
// - isDragging: boolean (para feedback visual)
// - isSaving: boolean (loading state)
```

**QRCodeCanvas.tsx (Canvas Interativo):**

Funcionalidades:
- `handleMouseDown`: Inicia arrasto do QR
- `handleMouseMove`: Atualiza posicao durante arrasto
- `handleMouseUp`: Finaliza arrasto
- `handleResize`: Redimensiona via handles
- `drawCanvas`: Renderiza imagem base + QR Code
- `exportAsImage`: Gera PNG para download

**QRCodeControls.tsx (Painel de Controles):**

```typescript
interface QRCodeControlsProps {
  config: QRVisualConfig;
  onChange: (config: Partial<QRVisualConfig>) => void;
  onUploadImage: (file: File) => void;
  onDownload: () => void;
}
```

---

### Templates Pre-definidos

Lista de templates de imagem para facilitar uso:

```typescript
const templates = [
  { name: "Cafeteira", url: "/templates/coffee-machine.png" },
  { name: "Parede Branca", url: "/templates/white-wall.png" },
  { name: "Mesa de Trabalho", url: "/templates/desk.png" },
  { name: "Porta", url: "/templates/door.png" },
  { name: "Equipamento", url: "/templates/equipment.png" },
];
```

---

### Mensagem de Aviso

Componente Alert informando:
- O QR Code e unico e permanente
- Apenas a aparencia visual pode ser alterada
- O codigo em si nunca muda

---

### Responsividade

**Desktop (>1024px):**
- Layout com canvas a esquerda, controles a direita
- Controles em painel lateral fixo

**Tablet (768-1024px):**
- Layout de duas colunas
- Controles abaixo do canvas

**Mobile (<768px):**
- Layout empilhado
- Canvas em tela cheia
- Controles em bottom sheet expansivel
- Gestos de toque para arrastar e redimensionar

---

### Ordem de Implementacao

1. Criar tipo `QRVisualConfig` e atualizar hook `useReminders`
2. Criar componente `QRCodeControls.tsx` com sliders
3. Criar componente `QRCodeCanvas.tsx` com drag-and-drop
4. Criar componente `QRCodeImageUpload.tsx`
5. Criar componente principal `QRCodeVisualEditor.tsx`
6. Criar pagina `QRCodeEditor.tsx`
7. Atualizar rotas em `App.tsx`
8. Atualizar `ReminderCard.tsx` para linkar ao editor
9. Adicionar logica de download de imagem
10. Testar responsividade

---

### Dependencias Necessarias

O projeto ja possui todas as dependencias necessarias:
- `qrcode.react` para geracao do QR Code
- Componentes UI (Slider, Button, etc.)
- Supabase para storage

---

### Consideracoes de UX

- Cursor muda para "move" ao passar sobre o QR
- Bordas pontilhadas ao redor do QR selecionado
- Handles visuais nos cantos para redimensionamento
- Toast de sucesso ao salvar
- Confirmacao ao sair sem salvar
- Loading state durante upload de imagem

