

## Tela de Escolha: Card vs AR

### Visao Geral

Adicionar uma tela intermediaria apos escanear o QR Code que oferece duas opcoes de visualizacao:

1. **Visualizar em Card** - Exibe a mensagem em um card simples e elegante (sem camera)
2. **Experiencia AR** - Abre a camera com o avatar 3D segurando a placa

---

### Fluxo Atualizado

```text
[QR Code Escaneado]
        |
        v
   [LOADING]
        |
        v
   [ESCOLHA]  <-- Nova tela
    /      \
   v        v
[CARD]    [AR]
```

---

### Estrutura de Arquivos

**Novos arquivos a criar:**

```text
src/
  components/
    ar/
      ViewModeSelector.tsx    # Tela de escolha (Card ou AR)
      CardView.tsx            # Visualizacao simples em card
```

**Arquivos a modificar:**

```text
src/
  pages/
    ARPreview.tsx             # Adicionar estado para modo de visualizacao
```

---

### Design da Tela de Escolha (ViewModeSelector.tsx)

```text
+--------------------------------------------------+
|                                                  |
|         [Logo AR Lembretes]                      |
|                                                  |
|    "Voce escaneou um lembrete!"                 |
|                                                  |
|         "Titulo do Lembrete"                     |
|         Icone Local: Nome do local              |
|                                                  |
|    "Como deseja visualizar?"                     |
|                                                  |
|  +--------------------------------------------+  |
|  |                                            |  |
|  |    [Icone Card]                            |  |
|  |                                            |  |
|  |    Ver Mensagem                            |  |
|  |    Visualizacao simples em card            |  |
|  |                                            |  |
|  +--------------------------------------------+  |
|                                                  |
|  +--------------------------------------------+  |
|  |                                            |  |
|  |    [Icone Sparkles/Camera]                 |  |
|  |                                            |  |
|  |    Experiencia AR                          |  |
|  |    Avatar 3D com realidade aumentada       |  |
|  |                                            |  |
|  +--------------------------------------------+  |
|                                                  |
|  Footer: By Joao Victor A.S Pascon              |
|                                                  |
+--------------------------------------------------+
```

---

### Design do CardView (CardView.tsx)

```text
+--------------------------------------------------+
|                                                  |
|  [X Fechar]                                      |
|                                                  |
|         [Logo AR Lembretes]                      |
|                                                  |
|  +--------------------------------------------+  |
|  |                                            |  |
|  |    TITULO DO LEMBRETE                      |  |
|  |                                            |  |
|  |    Icone Local: Nome do local              |  |
|  |    Criado por: Nome do Criador             |  |
|  |                                            |  |
|  |    +------------------------------------+  |  |
|  |    |                                    |  |  |
|  |    |      MENSAGEM DO LEMBRETE          |  |  |
|  |    |                                    |  |  |
|  |    +------------------------------------+  |  |
|  |                                            |  |
|  +--------------------------------------------+  |
|                                                  |
|  [Botao: Ver em AR]                             |
|                                                  |
|  Footer: By Joao Victor A.S Pascon              |
|                                                  |
+--------------------------------------------------+
```

---

### Detalhes Tecnicos

**1. ViewModeSelector.tsx:**

```typescript
interface ViewModeSelectorProps {
  title: string;
  location?: string;
  onSelectCard: () => void;
  onSelectAR: () => void;
}
```

Elementos visuais:
- Logo do AR Lembretes no topo
- Titulo do lembrete com destaque
- Localizacao (se houver)
- Dois botoes grandes estilizados com:
  - Icone representativo
  - Titulo do modo
  - Descricao curta
  - Efeito hover com scale e glow
  - Gradientes e sombras

**2. CardView.tsx:**

```typescript
interface CardViewProps {
  title: string;
  message: string;
  location?: string;
  creatorName?: string;
  onClose: () => void;
  onSwitchToAR: () => void;
}
```

Elementos:
- Header com botao de fechar
- Card central com informacoes
- Mensagem em destaque
- Botao para alternar para AR
- Footer com copyright

**3. ARPreview.tsx - Estados Atualizados:**

```typescript
type ViewMode = "loading" | "select" | "card" | "ar";

const [viewMode, setViewMode] = useState<ViewMode>("loading");
```

---

### Estilos dos Botoes de Escolha

Os botoes terao design premium com:

```text
+------------------------------------------+
|                                          |
|     [Icone grande - 48px]                |
|                                          |
|     TITULO PRINCIPAL                     |
|     Descricao secundaria                 |
|                                          |
+------------------------------------------+

Estilos:
- Altura: ~140px
- Largura: 100%
- Borda arredondada: 16px
- Background: glassmorphism (bg-white/10 + backdrop-blur)
- Borda: 1px com gradiente sutil
- Sombra: shadow-lg
- Hover: scale-105 + glow effect
- Transicao suave: 300ms
```

---

### Icones Utilizados

Do Lucide React:
- **Card View:** `FileText` ou `MessageSquare`
- **AR View:** `Sparkles` ou `Camera`
- **Localizacao:** `MapPin`
- **Fechar:** `X` ou `ArrowLeft`

---

### Codigo do ViewModeSelector

```typescript
import { Button } from "@/components/ui/button";
import { MapPin, FileText, Sparkles } from "lucide-react";
import logo from "@/assets/logo-ar-lembretes.png";

interface ViewModeSelectorProps {
  title: string;
  location?: string;
  onSelectCard: () => void;
  onSelectAR: () => void;
}

const ViewModeSelector = ({
  title,
  location,
  onSelectCard,
  onSelectAR,
}: ViewModeSelectorProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Logo */}
          <img src={logo} alt="AR Lembretes" className="h-16 mx-auto" />

          {/* Info do Lembrete */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Voce escaneou um lembrete!
            </p>
            <h1 className="text-2xl font-bold">{title}</h1>
            {location && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{location}</span>
              </div>
            )}
          </div>

          {/* Pergunta */}
          <p className="text-lg text-muted-foreground">
            Como deseja visualizar?
          </p>

          {/* Botoes de Escolha */}
          <div className="space-y-4">
            {/* Botao Card */}
            <button
              onClick={onSelectCard}
              className="w-full p-6 rounded-2xl bg-card/80 backdrop-blur border 
                         shadow-lg hover:shadow-xl hover:scale-[1.02] 
                         transition-all duration-300 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center 
                                justify-center group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Ver Mensagem</h3>
                  <p className="text-sm text-muted-foreground">
                    Visualizacao simples em card
                  </p>
                </div>
              </div>
            </button>

            {/* Botao AR */}
            <button
              onClick={onSelectAR}
              className="w-full p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 
                         backdrop-blur border border-primary/20
                         shadow-lg hover:shadow-xl hover:scale-[1.02] 
                         transition-all duration-300 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent 
                                flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Experiencia AR</h3>
                  <p className="text-sm text-muted-foreground">
                    Avatar 3D com realidade aumentada
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground">
        (c) {new Date().getFullYear()} AR Lembretes. By Joao Victor A.S Pascon
      </footer>
    </div>
  );
};

export default ViewModeSelector;
```

---

### Codigo do CardView

```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, User, Sparkles, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo-ar-lembretes.png";

interface CardViewProps {
  title: string;
  message: string;
  location?: string;
  creatorName?: string;
  onClose: () => void;
  onSwitchToAR: () => void;
}

const CardView = ({
  title,
  message,
  location,
  creatorName,
  onClose,
  onSwitchToAR,
}: CardViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          {/* Logo */}
          <img src={logo} alt="AR Lembretes" className="h-12 mx-auto" />

          {/* Card Principal */}
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{title}</CardTitle>
              <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
                {location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                )}
                {creatorName && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Criado por {creatorName}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-foreground whitespace-pre-wrap">{message}</p>
              </div>
            </CardContent>
          </Card>

          {/* Botao para AR */}
          <Button
            onClick={onSwitchToAR}
            size="lg"
            className="w-full h-14 text-lg font-semibold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Ver em Realidade Aumentada
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground">
        (c) {new Date().getFullYear()} AR Lembretes. By Joao Victor A.S Pascon
      </footer>
    </div>
  );
};

export default CardView;
```

---

### Modificacoes no ARPreview.tsx

```typescript
type ViewMode = "loading" | "select" | "card" | "ar";

const [viewMode, setViewMode] = useState<ViewMode>("loading");

// Apos carregar dados:
setViewMode("select");

// Render:
return (
  <>
    {viewMode === "loading" && <LoadingScreen />}
    {viewMode === "select" && (
      <ViewModeSelector
        title={reminder.title}
        location={reminder.locations?.name}
        onSelectCard={() => setViewMode("card")}
        onSelectAR={() => setViewMode("ar")}
      />
    )}
    {viewMode === "card" && (
      <CardView
        title={reminder.title}
        message={reminder.message}
        location={reminder.locations?.name}
        creatorName={profile?.name}
        onClose={handleClose}
        onSwitchToAR={() => setViewMode("ar")}
      />
    )}
    {viewMode === "ar" && (
      <ARExperience
        reminder={{...}}
        avatarConfig={avatarConfig}
        onClose={handleClose}
      />
    )}
  </>
);
```

---

### Resumo das Mudancas

| Arquivo | Acao |
|---------|------|
| `src/components/ar/ViewModeSelector.tsx` | Criar - Tela de escolha |
| `src/components/ar/CardView.tsx` | Criar - Visualizacao em card |
| `src/pages/ARPreview.tsx` | Modificar - Adicionar estados e logica |

---

### Beneficios

1. **Acessibilidade:** Usuarios sem camera podem ver a mensagem
2. **Flexibilidade:** Escolha do modo preferido
3. **Performance:** Card view carrega instantaneamente
4. **UX:** Transicao suave entre modos
5. **Design:** Interface moderna e intuitiva

