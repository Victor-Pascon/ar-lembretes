

## Logo/Marca no Centro do QR Code

### Visao Geral

Adicionar uma nova funcionalidade que permite inserir uma imagem (logo, marca, icone) no centro do QR Code, mantendo a funcionalidade existente de imagem de fundo.

---

### Diferenca entre as duas opcoes

```text
IMAGEM DE FUNDO (ja existe):     LOGO NO CENTRO (nova):
+---------------------------+    +---------------------------+
|   [imagem de fundo]       |    |                           |
|                           |    |   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓       |
|     ▓▓▓▓▓▓▓▓▓             |    |   ▓▓             ▓▓       |
|     ▓▓      ▓▓            |    |   ▓▓  [LOGO]    ▓▓       |
|     ▓▓      ▓▓            |    |   ▓▓             ▓▓       |
|     ▓▓▓▓▓▓▓▓▓             |    |   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓       |
|                           |    |                           |
+---------------------------+    +---------------------------+
     QR sobre a imagem              Logo dentro do QR
```

---

### Arquivos a Modificar

| Arquivo | Mudanca |
|---------|---------|
| `src/types/qr-visual-config.ts` | Adicionar campos para logo central |
| `src/components/reminders/QRCodeCanvas.tsx` | Usar imageSettings do qrcode.react |
| `src/components/reminders/QRCodeControls.tsx` | Adicionar secao de upload do logo |
| `src/components/reminders/QRCodeVisualEditor.tsx` | Gerenciar estado do logo central |

---

### Atualizacao do QRVisualConfig

```typescript
export interface QRVisualConfig {
  // Cores (existente)
  foreground: string;
  background: string;
  
  // Posicionamento do QR (existente)
  position: { x: number; y: number };
  size: number;
  rotation: number;
  opacity: number;
  
  // Imagem de fundo (existente)
  baseImageUrl?: string;
  
  // NOVO - Logo no centro do QR
  centerLogoUrl?: string;
  centerLogoSize?: number; // Percentual do tamanho do QR (10-40%)
}

export const defaultQRVisualConfig: QRVisualConfig = {
  foreground: "#7c3aed",
  background: "#ffffff",
  position: { x: 50, y: 50 },
  size: 150,
  rotation: 0,
  opacity: 1,
  centerLogoSize: 25, // 25% do QR por padrao
};
```

---

### Implementacao no QRCodeCanvas

O componente `QRCodeSVG` do qrcode.react suporta a prop `imageSettings`:

```typescript
<QRCodeSVG
  value={qrUrl}
  size={config.size}
  fgColor={config.foreground}
  bgColor={config.background}
  level="H" // Aumentar para "H" quando usar logo (mais redundancia)
  includeMargin={false}
  imageSettings={centerLogoUrl ? {
    src: centerLogoUrl,
    height: logoPixelSize,
    width: logoPixelSize,
    excavate: true, // Remove os pixels do QR atras do logo
  } : undefined}
/>
```

**Nota importante:** Quando um logo e adicionado, o nivel de correcao de erro deve ser aumentado para "H" (High - 30%) para garantir que o QR continue escaneavel mesmo com o logo no centro.

---

### Nova Secao no QRCodeControls

```text
+------------------------------------------+
|  Controles                               |
+------------------------------------------+
|                                          |
|  Tamanho         [=========|---] 150px   |
|  Opacidade       [=========|---] 100%    |
|  Rotacao         [---|=========] 0°      |
|                                          |
|  -- Cores do QR Code --                  |
|  [■] Codigo    [■] Fundo                 |
|                                          |
|  -- Imagem de Fundo --                   |  <-- Existente
|  [Upload Imagem]                         |
|  Imagem carregada ✓                      |
|                                          |
|  -- Logo Central --                      |  <-- NOVO
|  [Upload Logo]  [Remover]                |
|  [Preview do logo]                       |
|  Tamanho: [====|------] 25%              |
|                                          |
|  [Baixar Imagem]                         |
|  [Resetar]                               |
+------------------------------------------+
```

---

### Detalhes Tecnicos

#### 1. Prop imageSettings do qrcode.react

```typescript
interface ImageSettings {
  src: string;        // URL ou base64 da imagem
  x?: number;         // Posicao X (opcional, centraliza por padrao)
  y?: number;         // Posicao Y (opcional, centraliza por padrao)
  height: number;     // Altura em pixels
  width: number;      // Largura em pixels
  excavate?: boolean; // Remove pixels do QR sob a imagem
}
```

#### 2. Calculo do tamanho do logo

```typescript
// Tamanho do logo em pixels baseado no percentual
const logoPixelSize = Math.round(
  (config.size * (config.centerLogoSize || 25)) / 100
);
```

#### 3. Nivel de correcao de erro

| Nivel | Redundancia | Uso |
|-------|-------------|-----|
| L (Low) | ~7% | QR sem logo |
| M (Medium) | ~15% | Padrao atual |
| Q (Quartile) | ~25% | Logo pequeno |
| H (High) | ~30% | Logo grande (recomendado) |

#### 4. Exportacao da imagem com logo

Na funcao `exportAsImage`, o logo ja sera incluido automaticamente pois faz parte do SVG renderizado.

---

### Interface do QRCodeControls Atualizada

```typescript
interface QRCodeControlsProps {
  config: QRVisualConfig;
  onChange: (updates: Partial<QRVisualConfig>) => void;
  onUploadImage: (file: File) => void;        // Existente (fundo)
  onUploadCenterLogo: (file: File) => void;   // NOVO
  onRemoveCenterLogo: () => void;             // NOVO
  onDownload: () => void;
  onReset: () => void;
  isDownloading?: boolean;
  centerLogo: string | null;                  // NOVO
}
```

---

### Validacoes e Limites

1. **Tamanho do logo:** 10% a 40% do QR (evitar cobrir muito do codigo)
2. **Formatos aceitos:** PNG, JPG, SVG (PNG com transparencia recomendado)
3. **Tamanho do arquivo:** Limite de 500KB para evitar base64 muito grande
4. **Proporcao:** Manter aspecto quadrado para melhor resultado

---

### Fluxo do Usuario

1. Usuario acessa personalizacao do QR
2. Faz upload de imagem de fundo (opcional)
3. Faz upload do logo central (nova opcao)
4. Ajusta tamanho do logo (slider 10-40%)
5. Visualiza preview em tempo real
6. Salva ou faz download

---

### Codigo da Secao "Logo Central" no Controls

```typescript
{/* Logo Central */}
<div className="space-y-3">
  <Label className="text-sm font-medium">Logo Central</Label>
  
  {centerLogo ? (
    <div className="space-y-3">
      {/* Preview do logo */}
      <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
        <img
          src={centerLogo}
          alt="Logo"
          className="w-12 h-12 object-contain rounded"
        />
        <div className="flex-1 text-xs text-muted-foreground">
          Logo carregado
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemoveCenterLogo}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Tamanho do logo */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Tamanho do Logo</Label>
          <span className="text-xs text-muted-foreground">
            {config.centerLogoSize || 25}%
          </span>
        </div>
        <Slider
          value={[config.centerLogoSize || 25]}
          onValueChange={([value]) => onChange({ centerLogoSize: value })}
          min={10}
          max={40}
          step={5}
        />
      </div>
    </div>
  ) : (
    <label className="flex-1">
      <input
        type="file"
        accept="image/*"
        onChange={handleLogoChange}
        className="sr-only"
      />
      <Button variant="outline" className="w-full" asChild>
        <span>
          <ImagePlus className="w-4 h-4 mr-2" />
          Adicionar Logo
        </span>
      </Button>
    </label>
  )}
  
  <p className="text-xs text-muted-foreground">
    Adicione seu logo ou marca no centro do QR Code
  </p>
</div>
```

---

### Resumo das Mudancas

| Componente | Mudanca |
|------------|---------|
| `QRVisualConfig` | +2 campos: `centerLogoUrl`, `centerLogoSize` |
| `QRCodeCanvas` | Usar `imageSettings` e nivel "H" |
| `QRCodeControls` | Nova secao de upload de logo |
| `QRCodeVisualEditor` | Gerenciar estado `centerLogo` |

---

### Beneficios

1. **Branding:** Usuarios podem adicionar sua marca ao QR
2. **Profissionalismo:** QR codes mais atrativos e personalizados
3. **Compatibilidade:** qrcode.react ja suporta nativamente
4. **Escaneabilidade:** Nivel H garante leitura mesmo com logo

