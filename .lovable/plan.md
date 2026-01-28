

## Controles Interativos no Modo AR

### Situacao Atual

O avatar no AR tem:
- Animacao de flutuacao automatica
- Animacao de respiracao
- Leve balanco lateral

Mas **NAO permite**:
- Arrastar para mover
- Gesto de pinça para ampliar/reduzir
- Rotacao manual pelo usuario

---

### Funcionalidades Propostas

```text
+--------------------------------------------------+
|                                                  |
|   [X]                                    [i]     |
|                                                  |
|                                                  |
|           +------------------+                   |
|           |                  |                   |
|           |   [Avatar 3D]    |  <-- Arrastar     |
|           |                  |      para mover   |
|           +------------------+                   |
|                                                  |
|   Gestos disponiveis:                            |
|   - 1 dedo: Arrastar avatar                      |
|   - 2 dedos (pinça): Zoom in/out                 |
|   - 2 dedos (girar): Rotacionar avatar           |
|                                                  |
|   +------------------------------------------+   |
|   |  [-]  [====|=====]  [+]   Tamanho        |   |
|   +------------------------------------------+   |
|                                                  |
|   [Resetar Posicao]                              |
|                                                  |
|         🎯 Experiência AR ativa                  |
+--------------------------------------------------+
```

---

### Interacoes por Gestos (Touch)

| Gesto | Acao | Descricao |
|-------|------|-----------|
| 1 dedo arrastar | Mover | Move o avatar na tela (X/Y) |
| Pinça (2 dedos) | Zoom | Amplia ou reduz o avatar |
| Rotacao (2 dedos) | Girar | Rotaciona o avatar no eixo Y |
| Toque duplo | Reset | Volta posicao/tamanho original |

---

### Implementacao Tecnica

#### 1. Estado de Transformacao

```typescript
interface AvatarTransform {
  position: { x: number; y: number; z: number };
  rotation: number; // Eixo Y
  scale: number;
}

const [transform, setTransform] = useState<AvatarTransform>({
  position: { x: 0, y: 0, z: 0 },
  rotation: 0,
  scale: 1,
});
```

#### 2. Controles da Biblioteca Drei

Usar `OrbitControls` ou gestos customizados:

```typescript
import { OrbitControls } from "@react-three/drei";

// Dentro do Canvas
<OrbitControls
  enablePan={true}      // Arrastar
  enableZoom={true}     // Pinça
  enableRotate={true}   // Rotacao
  minDistance={2}       // Zoom minimo
  maxDistance={10}      // Zoom maximo
  target={[0, 1, 0]}    // Ponto focal no avatar
/>
```

#### 3. Controles Customizados (Alternativa)

Para mais controle sobre os gestos:

```typescript
// Hook customizado para gestos touch
const useAvatarGestures = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState<Touch | null>(null);
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setLastTouch(e.touches[0]);
    } else if (e.touches.length === 2) {
      // Pinch start
      const distance = getDistance(e.touches[0], e.touches[1]);
      setInitialPinchDistance(distance);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 1 && isDragging && lastTouch) {
      // Drag - mover avatar
      const deltaX = (e.touches[0].clientX - lastTouch.clientX) * 0.01;
      const deltaY = (e.touches[0].clientY - lastTouch.clientY) * -0.01;
      setTransform(prev => ({
        ...prev,
        position: {
          x: prev.position.x + deltaX,
          y: prev.position.y + deltaY,
          z: prev.position.z,
        }
      }));
      setLastTouch(e.touches[0]);
    } else if (e.touches.length === 2 && initialPinchDistance) {
      // Pinch - zoom
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scaleFactor = currentDistance / initialPinchDistance;
      setTransform(prev => ({
        ...prev,
        scale: Math.max(0.5, Math.min(2, prev.scale * scaleFactor))
      }));
    }
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
};
```

---

### UI de Controles Opcionais

Adicionar botoes para usuarios que preferem controles visuais:

```text
+--------------------------------------------------+
|                                                  |
|  Controles (opcao visual):                       |
|                                                  |
|  Tamanho:  [-]  [========|===]  [+]              |
|                                                  |
|  Rotacao:  [<]  [=====|======]  [>]              |
|                                                  |
|  [Resetar]                                       |
|                                                  |
+--------------------------------------------------+
```

---

### Arquivos a Modificar

| Arquivo | Mudanca |
|---------|---------|
| `src/components/ar/ARCameraView.tsx` | Adicionar OrbitControls e estado de transform |
| `src/components/ar/ARAvatarWithSign.tsx` | Receber props de transform e aplicar |
| `src/components/ar/ARControlsOverlay.tsx` | NOVO - Controles visuais opcionais |

---

### Mudancas no ARCameraView.tsx

```typescript
import { OrbitControls } from "@react-three/drei";

// Novo estado
const [avatarScale, setAvatarScale] = useState(1);
const [showControls, setShowControls] = useState(false);

// No Canvas
<Canvas ...>
  <OrbitControls
    enablePan={true}
    enableZoom={true}
    enableRotate={true}
    minDistance={3}
    maxDistance={8}
    target={[0, 1, 0]}
    maxPolarAngle={Math.PI / 1.5}
    minPolarAngle={Math.PI / 4}
  />
  
  <ARAvatarWithSign 
    config={avatarConfig} 
    message={message}
    scale={avatarScale}
  />
</Canvas>
```

---

### Mudancas no ARAvatarWithSign.tsx

```typescript
interface ARAvatarWithSignProps {
  config: AvatarConfig;
  message: string;
  scale?: number;          // NOVO
  userRotation?: number;   // NOVO
}

// Aplicar transformacoes
<group 
  ref={groupRef} 
  position={[0, 0, 0]}
  scale={scale || 1}
>
  {/* Conteudo do avatar */}
</group>
```

---

### Novo Componente: ARControlsOverlay.tsx

Controles visuais na parte inferior da tela:

```typescript
interface ARControlsOverlayProps {
  scale: number;
  onScaleChange: (scale: number) => void;
  onReset: () => void;
}

const ARControlsOverlay = ({ scale, onScaleChange, onReset }: ARControlsOverlayProps) => {
  return (
    <div className="absolute bottom-20 inset-x-0 px-4">
      <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-4 space-y-3">
        {/* Slider de tamanho */}
        <div className="flex items-center gap-3">
          <Button 
            size="icon" 
            variant="ghost"
            onClick={() => onScaleChange(Math.max(0.5, scale - 0.1))}
          >
            <Minus className="w-4 h-4" />
          </Button>
          
          <Slider
            value={[scale]}
            onValueChange={([v]) => onScaleChange(v)}
            min={0.5}
            max={2}
            step={0.1}
            className="flex-1"
          />
          
          <Button 
            size="icon" 
            variant="ghost"
            onClick={() => onScaleChange(Math.min(2, scale + 0.1))}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Botao de reset */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onReset}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Resetar Posicao
        </Button>
      </div>
    </div>
  );
};
```

---

### Indicador de Gestos (Primeira Vez)

Mostrar dicas na primeira vez que o usuario acessa:

```text
+--------------------------------------------------+
|                                                  |
|        +----------------------------+            |
|        |  👆 Arraste para mover     |            |
|        |                            |            |
|        |  🤏 Pinça para zoom        |            |
|        |                            |            |
|        |  👉👈 Gire com 2 dedos     |            |
|        |                            |            |
|        |      [Entendi!]            |            |
|        +----------------------------+            |
|                                                  |
+--------------------------------------------------+
```

---

### Limites de Transformacao

Para evitar que o usuario "perca" o avatar:

| Propriedade | Minimo | Maximo |
|-------------|--------|--------|
| Scale | 0.5x | 2.0x |
| Posicao X | -3 | +3 |
| Posicao Y | -1 | +3 |
| Rotacao Y | -180° | +180° |
| Distancia Camera | 3 | 8 |

---

### Resumo das Mudancas

| Tipo | Arquivo | Mudanca |
|------|---------|---------|
| MOD | `ARCameraView.tsx` | Adicionar OrbitControls, estado de scale, botao de controles |
| MOD | `ARAvatarWithSign.tsx` | Adicionar props scale e userRotation |
| NOVO | `ARControlsOverlay.tsx` | Painel de controles visuais |
| NOVO | `ARGestureHint.tsx` | Modal de dicas de gestos (opcional) |

---

### Beneficios

1. **Experiencia Imersiva** - Usuario posiciona avatar onde quiser no ambiente
2. **Fotos Melhores** - Ajustar tamanho/posicao para tirar screenshots
3. **Acessibilidade** - Controles visuais para quem prefere botoes
4. **Intuitividade** - Gestos naturais de smartphone (arrastar, pincar)

