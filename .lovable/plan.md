
## Melhorias no Menu de Conta e Avatares Cartoon

### Visao Geral

Este plano aborda tres melhorias principais:

1. **Menu da Conta** - Adicionar opcoes para gerenciar locais cadastrados
2. **Visualizacao de Avatar** - Criar modo de visualizacao antes de permitir edicao
3. **Estilo Cartoon** - Melhorar visual dos avatares 3D com estilo mais cartoon/estilizado

---

### Parte 1: Gerenciamento de Locais no Menu

#### Novos Arquivos

| Arquivo | Descricao |
|---------|-----------|
| `src/components/locations/LocationsManagementDialog.tsx` | Dialog para visualizar/editar locais |
| `src/pages/Locations.tsx` | Pagina dedicada para gerenciamento de locais (opcional) |

#### Modificacoes no DashboardHeader

Adicionar novas opcoes ao dropdown menu:

```text
+----------------------------------+
|  Nome do Usuario                 |
|  email@example.com               |
+----------------------------------+
|  [User] Meu Avatar               |  <-- Modificar para VIEW primeiro
|  [MapPin] Meus Locais            |  <-- NOVO
|  [Settings] Configuracoes        |
+----------------------------------+
|  [LogOut] Sair                   |
+----------------------------------+
```

#### LocationsManagementDialog

Interface para visualizar e editar locais:

```text
+--------------------------------------------------+
|  Meus Locais                              [X]    |
+--------------------------------------------------+
|  [+ Novo Local]                                  |
|                                                  |
|  +--------------------------------------------+  |
|  | Sala de Reunioes A                         |  |
|  | Bloco B, 2o andar                          |  |
|  | [Editar] [Excluir]                         |  |
|  +--------------------------------------------+  |
|                                                  |
|  +--------------------------------------------+  |
|  | Cafeteira                                  |  |
|  | Direcao                                    |  |
|  | [Editar] [Excluir]                         |  |
|  +--------------------------------------------+  |
|                                                  |
+--------------------------------------------------+
```

Funcionalidades:
- Lista todos os locais do usuario
- Botao para criar novo local (abre LocationFormDialog existente)
- Botao para editar cada local
- Botao para excluir com confirmacao
- Contador de lembretes vinculados a cada local

---

### Parte 2: Pagina de Avatar com Modo de Visualizacao

#### Nova Rota

```typescript
// App.tsx
<Route path="/my-avatar" element={<MyAvatar />} />
```

#### Novo Arquivo: MyAvatar.tsx

Pagina com dois modos:

**Modo VIEW (padrao)**
```text
+--------------------------------------------------+
|  [<- Voltar]                   Meu Avatar 3D     |
+--------------------------------------------------+
|                                                  |
|         +------------------------+               |
|         |                        |               |
|         |   [Avatar 3D Preview]  |               |
|         |     (rotacionavel)     |               |
|         |                        |               |
|         +------------------------+               |
|                                                  |
|         Nome do Usuario                          |
|                                                  |
|         Caracteristicas:                         |
|         - Cabelo: Rabo de Cavalo, Castanho       |
|         - Rosto: Coracao                         |
|         - Expressao: Feliz                       |
|         - Acessorios: Oculos, Chapeu             |
|                                                  |
|         [Editar Avatar]                          |
|                                                  |
+--------------------------------------------------+
```

**Modo EDIT**
- Reutiliza AvatarCustomizer existente
- Botao "Salvar" e "Cancelar"
- Preview em tempo real

#### Logica de Estado

```typescript
const [mode, setMode] = useState<"view" | "edit">("view");
const [originalConfig, setOriginalConfig] = useState<AvatarConfig | null>(null);

// Ao clicar em "Editar"
const handleStartEdit = () => {
  setOriginalConfig({...avatarConfig}); // Salvar backup
  setMode("edit");
};

// Ao clicar em "Cancelar"
const handleCancelEdit = () => {
  if (originalConfig) setAvatarConfig(originalConfig);
  setMode("view");
};
```

#### Atualizacao do Menu

Mudar "Meu Avatar" para navegar para `/my-avatar` ao inves de `/create-avatar`

---

### Parte 3: Melhorias Visuais - Estilo Cartoon

#### Conceito Visual

Transformar avatares de "low-poly realista" para "cartoon estilizado":

```text
ANTES (atual):               DEPOIS (cartoon):
    ___                          ____
   /   \                        /    \
  | . . |                      ( O  O )
  |  >  |      -->             (  <>  )
  | --- |                      ( \__/ )
   \___/                        \____/
                               
Proporcoes realistas          Proporcoes exageradas
Cores sutis                   Cores vibrantes
Formas naturais               Formas arredondadas
```

#### Mudancas Especificas

**1. Cabeca (HeadGeometry.tsx)**

```typescript
// ANTES: Cabeca proporcional
<sphereGeometry args={[0.65, 32, 32]} />

// DEPOIS: Cabeca maior e mais arredondada (estilo chibi/cartoon)
<sphereGeometry args={[0.75, 32, 32]} />
// Proporcao cabeca:corpo aumentada de 1:3 para 1:2
```

**2. Olhos (FacialFeatures.tsx)**

```typescript
// ANTES: Olhos pequenos e realistas
<sphereGeometry args={[0.12, 16, 16]} />

// DEPOIS: Olhos grandes e expressivos (estilo anime/cartoon)
<sphereGeometry args={[0.18, 16, 16]} />
// Pupilas maiores com brilho mais intenso
// Adicionar "sparkle" (brilho estelar) nos olhos
```

**3. Corpo (Body.tsx)**

```typescript
// ANTES: Corpo proporcional
position={[0, 0.45, 0]}

// DEPOIS: Corpo menor em relacao a cabeca
position={[0, 0.3, 0]}
// Bracos mais curtos e arredondados
// Maos como "luvas" estilo Mickey Mouse
```

**4. Materiais Cartoon**

```typescript
// Material com shader toon/cel-shading
const cartoonMaterial = new THREE.MeshToonMaterial({
  color: config.skinColor,
  gradientMap: toonGradient, // 3 tons de cor
});
```

**5. Outlines (Contornos)**

Adicionar contornos pretos ao redor das formas para efeito cartoon:

```typescript
// Usando segunda mesh com escala ligeiramente maior
<mesh scale={[1.02, 1.02, 1.02]}>
  <sphereGeometry args={[0.75, 32, 32]} />
  <meshBasicMaterial color="#000000" side={THREE.BackSide} />
</mesh>
```

#### Proporcoes Cartoon

| Parte | Antes | Depois |
|-------|-------|--------|
| Cabeca | 0.65 raio | 0.80 raio |
| Olhos | 0.12 raio | 0.20 raio |
| Corpo altura | 0.9 | 0.7 |
| Maos | Esferas simples | Maos "luva" com 4 dedos visíveis |
| Pescoco | 0.2 altura | 0.12 altura (mais curto) |

#### Expressoes Mais Exageradas

```typescript
// Expressao feliz - sorriso maior
const getMouthProps = () => {
  switch (config.expression) {
    case "happy":
      return { 
        type: "bigSmile", 
        scale: 1.5,  // Sorriso 50% maior
        showTeeth: true 
      };
    // ...
  }
};
```

---

### Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/components/locations/LocationsManagementDialog.tsx` | Gerenciamento de locais |
| `src/components/locations/LocationEditDialog.tsx` | Edicao de local individual |
| `src/pages/MyAvatar.tsx` | Pagina de visualizacao/edicao de avatar |

### Arquivos a Modificar

| Arquivo | Mudanca |
|---------|---------|
| `src/components/dashboard/DashboardHeader.tsx` | Adicionar "Meus Locais", mudar link do avatar |
| `src/App.tsx` | Adicionar rota `/my-avatar` |
| `src/hooks/useLocations.ts` | Ja tem updateLocation e deleteLocation (ok) |
| `src/components/avatar/parts/HeadGeometry.tsx` | Proporcoes cartoon |
| `src/components/avatar/parts/FacialFeatures.tsx` | Olhos maiores, expressoes exageradas |
| `src/components/avatar/parts/Body.tsx` | Corpo menor, maos cartoon |
| `src/components/avatar/parts/HairStyles.tsx` | Cabelos mais volumosos |
| `src/components/avatar/AvatarModel.tsx` | Adicionar outline/contorno |

---

### Detalhes Tecnicos - LocationsManagementDialog

```typescript
interface LocationsManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Componente usa useLocations hook existente
const { locations, updateLocation, deleteLocation, createLocation } = useLocations();
```

**Funcionalidades:**
- Listar locais com ScrollArea para muitos itens
- Editar inline ou em dialog separado
- Excluir com AlertDialog de confirmacao
- Mostrar badge com numero de lembretes vinculados

---

### Detalhes Tecnicos - MyAvatar Page

```typescript
const MyAvatar = () => {
  const { profile, isLoading } = useProfile();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Carregar config do perfil
  useEffect(() => {
    if (profile?.avatar_config) {
      setAvatarConfig(normalizeAvatarConfig(profile.avatar_config));
    } else {
      setAvatarConfig(getDefaultAvatarConfig());
    }
  }, [profile]);
  
  // Renderizar VIEW ou EDIT mode
  return mode === "view" ? (
    <AvatarViewMode config={avatarConfig} onEdit={() => setMode("edit")} />
  ) : (
    <AvatarEditMode 
      config={avatarConfig} 
      onChange={setAvatarConfig}
      onSave={handleSave}
      onCancel={() => setMode("view")}
    />
  );
};
```

---

### Resumo de Mudancas

#### Menu da Conta
- Nova opcao "Meus Locais" no dropdown
- Dialog para visualizar/editar/excluir locais
- Link "Meu Avatar" agora vai para pagina de visualizacao

#### Avatar
- Nova pagina `/my-avatar` com modo VIEW primeiro
- Usuario ve seu avatar antes de decidir editar
- Mostra informacoes do avatar (cabelo, acessorios, etc.)
- Botao "Editar" para entrar no modo de edicao

#### Estilo Cartoon
- Cabeca maior (proporcao chibi)
- Olhos grandes e expressivos com brilho
- Corpo menor e mais fofo
- Contornos pretos para efeito cartoon
- Cores mais vibrantes
- Expressoes mais exageradas
- Maos estilo luva de desenho animado

---

### Beneficios

1. **UX Melhorada** - Usuarios podem gerenciar locais sem sair do dashboard
2. **Visualizacao Primeiro** - Ver avatar antes de editar previne edicoes acidentais
3. **Estilo Atrativo** - Avatares cartoon sao mais cativantes e memoraveis
4. **Consistencia** - Estilo cartoon combina melhor com a proposta ludica do app AR
