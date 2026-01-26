

## Tela Publica de Realidade Aumentada

### Visao Geral

Transformar a pagina atual `/ar/:reminderId` (ARPreview) de uma simples visualizacao de card para uma experiencia completa de Realidade Aumentada com:

1. Tela inicial com instrucoes e botao "Iniciar experiencia"
2. Solicitacao de permissao da camera
3. Visualizacao em tempo real da camera como background
4. Avatar 3D sobreposto segurando uma placa com a mensagem dinamica
5. Tratamento de erros e estados de carregamento

---

### Arquitetura da Solucao

```text
+------------------------------------------------------------------+
|                    TELA AR PUBLICA                                |
+------------------------------------------------------------------+
|                                                                   |
|  ESTADO 1: INICIO                                                 |
|  +-------------------------------------------------------------+  |
|  |                                                             |  |
|  |     [Icone AR animado]                                      |  |
|  |                                                             |  |
|  |     "Voce escaneou um lembrete!"                           |  |
|  |     "Posicione seu celular para ver                        |  |
|  |      a mensagem em realidade aumentada"                    |  |
|  |                                                             |  |
|  |     [Iniciar experiencia AR]                               |  |
|  |                                                             |  |
|  +-------------------------------------------------------------+  |
|                                                                   |
|  ESTADO 2: CAMERA ATIVA                                           |
|  +-------------------------------------------------------------+  |
|  | +---------------------------+                               |  |
|  | |  CAMERA (fullscreen)      |                               |  |
|  | |                           |                               |  |
|  | |     +-------------+       |                               |  |
|  | |     |   AVATAR    |       |                               |  |
|  | |     |    3D       |       |                               |  |
|  | |     +-------------+       |                               |  |
|  | |     |  PLACA COM  |       |                               |  |
|  | |     |  MENSAGEM   |       |                               |  |
|  | |     +-------------+       |                               |  |
|  | |                           |                               |  |
|  | +---------------------------+                               |  |
|  |                                                             |  |
|  |  [X Fechar]                   [i Info]                     |  |
|  +-------------------------------------------------------------+  |
|                                                                   |
+------------------------------------------------------------------+
```

---

### Estrutura de Arquivos

**Novos arquivos a criar:**

```text
src/
  components/
    ar/
      ARExperience.tsx           # Container principal da experiencia AR
      ARStartScreen.tsx          # Tela inicial com instrucoes
      ARCameraView.tsx           # View com camera + avatar 3D
      ARMessageSign.tsx          # Placa/cartaz com mensagem
      ARAvatarWithSign.tsx       # Avatar 3D segurando a placa
  pages/
    ARPreview.tsx                # Atualizar para usar novos componentes
```

---

### Fluxo de Estados

```text
[LOADING]
    |
    v
[INICIO] --> Clica "Iniciar" --> [PERMISSAO_CAMERA]
                                        |
                       Permitido? ------+------ Negado?
                           |                      |
                           v                      v
                    [CAMERA_ATIVA]          [ERRO_CAMERA]
                           |
                           v
                    [AR_EXPERIENCE]
                    (Avatar 3D + Placa)
```

---

### Detalhes Tecnicos

**1. ARStartScreen.tsx - Tela Inicial:**

```typescript
interface ARStartScreenProps {
  title: string;
  location?: string;
  onStart: () => void;
}
```

Elementos:
- Icone animado de AR (pulsando)
- Titulo do lembrete
- Local (se houver)
- Instrucoes curtas
- Botao "Iniciar experiencia AR"

**2. ARCameraView.tsx - Camera com Overlay 3D:**

Utilizara `react-webcam` (ja instalado) para captura da camera em tempo real.
O Canvas Three.js sera renderizado em overlay transparente sobre a camera.

```typescript
interface ARCameraViewProps {
  message: string;
  avatarConfig: AvatarConfig;
  onClose: () => void;
}
```

**3. ARAvatarWithSign.tsx - Avatar 3D com Placa:**

Reutiliza o componente `AvatarModel` existente, adicionando:
- Bracos estendidos segurando uma placa
- Placa 3D com texto renderizado via `Text` do drei
- Animacao suave de flutuacao

```typescript
interface ARAvatarWithSignProps {
  config: AvatarConfig;
  message: string;
}
```

**4. ARMessageSign.tsx - Placa de Mensagem 3D:**

```typescript
interface ARMessageSignProps {
  message: string;
  maxWidth?: number;
}
```

Componente Three.js com:
- Geometria de placa (box achatado ou plane)
- Textura de texto usando `Text` do @react-three/drei
- Borda e sombra para destaque

---

### Integracao com Camera

A camera sera implementada usando `react-webcam` (ja instalado no projeto).

```typescript
// ARCameraView.tsx
<div className="fixed inset-0">
  {/* Camera como background */}
  <Webcam
    className="absolute inset-0 w-full h-full object-cover"
    videoConstraints={{ facingMode: "environment" }}
  />
  
  {/* Canvas 3D em overlay */}
  <div className="absolute inset-0">
    <Canvas gl={{ alpha: true }}>
      <ARAvatarWithSign config={avatarConfig} message={message} />
    </Canvas>
  </div>
</div>
```

---

### Tratamento de Erros

Estados de erro a cobrir:
1. Lembrete nao encontrado ou inativo
2. Camera nao disponivel
3. Permissao de camera negada
4. Erro ao carregar dados

Cada estado tera uma UI dedicada com:
- Icone visual
- Mensagem explicativa
- Botao de acao (tentar novamente ou voltar)

---

### Responsividade

A experiencia e otimizada para mobile:

- Layout fullscreen em dispositivos moveis
- Camera traseira como padrao (`facingMode: "environment"`)
- Touch para interagir com o avatar
- Botoes grandes e acessiveis
- Orientacao portrait/landscape suportada

---

### Carregamento do Perfil do Criador

Atualmente o ARPreview busca o perfil de forma separada. Para a experiencia AR:

1. Buscar o reminder pelo `qr_code_data`
2. Usar o `user_id` do reminder para buscar o perfil do criador
3. Extrair `avatar_config` do perfil para renderizar o avatar 3D

```typescript
// Busca correta do perfil do criador
const { data: profileData } = await supabase
  .from("profiles")
  .select("name, avatar_url, avatar_config")
  .eq("user_id", reminder.user_id)
  .single();
```

---

### Configuracao Padrao do Avatar

Se o criador nao tiver avatar configurado, usar um avatar padrao:

```typescript
const defaultAvatarConfig: AvatarConfig = {
  skinColor: "#e0b8a0",
  hairColor: "#3d2314",
  eyeColor: "#4a6741",
  hairStyle: "short",
  hasGlasses: false,
};
```

---

### Componente Principal Atualizado (ARPreview.tsx)

```typescript
// Estados da experiencia
type ARState = "loading" | "start" | "camera" | "error";

const [arState, setArState] = useState<ARState>("loading");

return (
  <>
    {arState === "loading" && <LoadingScreen />}
    {arState === "start" && (
      <ARStartScreen 
        title={reminder.title} 
        location={reminder.locations?.name}
        onStart={() => setArState("camera")} 
      />
    )}
    {arState === "camera" && (
      <ARCameraView
        message={reminder.message}
        avatarConfig={avatarConfig}
        onClose={() => navigate("/")}
      />
    )}
    {arState === "error" && <ErrorScreen error={error} />}
  </>
);
```

---

### Animacoes e UX

1. **Tela inicial:**
   - Icone pulsando
   - Fade in dos elementos
   - Botao com hover/tap feedback

2. **Transicao para camera:**
   - Fade out da tela inicial
   - Fade in da camera

3. **Avatar 3D:**
   - Animacao de flutuacao suave (floating)
   - Placa balancando levemente
   - Rotacao automatica leve do avatar

4. **Controles:**
   - Botao de fechar no canto
   - Botao de informacoes do lembrete

---

### Alternativa WebXR

Para dispositivos que suportam WebXR (navegadores modernos em Android), podemos oferecer uma experiencia ainda mais imersiva usando `@react-three/xr`. Porem, devido a limitacoes de suporte (especialmente iOS), a implementacao inicial usara a abordagem de camera overlay, que funciona em todos os dispositivos.

No futuro, pode-se adicionar deteccao de suporte WebXR:

```typescript
const supportsWebXR = 'xr' in navigator;

if (supportsWebXR && isAndroid) {
  // Usar @react-three/xr para AR real
} else {
  // Usar camera overlay com Three.js
}
```

---

### Ordem de Implementacao

1. Criar componente `ARStartScreen.tsx` com UI de boas-vindas
2. Criar componente `ARMessageSign.tsx` para a placa 3D
3. Criar componente `ARAvatarWithSign.tsx` integrando avatar + placa
4. Criar componente `ARCameraView.tsx` com camera + overlay 3D
5. Criar componente `ARExperience.tsx` como orquestrador
6. Atualizar `ARPreview.tsx` para usar a nova arquitetura
7. Adicionar tratamento de erros e estados
8. Testar em dispositivos moveis

---

### Dependencias Necessarias

Todas as dependencias ja estao instaladas:
- `react-webcam` - Captura de camera
- `@react-three/fiber` - Renderizacao 3D
- `@react-three/drei` - Helpers como Text, OrbitControls

---

### Consideracoes de Performance

- Usar `React.memo` nos componentes 3D
- Limitar FPS do canvas se necessario
- Compactar texturas e geometrias
- Lazy loading dos componentes AR
- Desmontar canvas ao sair da experiencia

