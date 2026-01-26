

## Correção da Experiência AR - Avatar Não Aparecendo

### Problemas Identificados

Analisando o código e a estrutura do projeto, encontrei **dois problemas críticos**:

---

### Problema 1: Fonte Inexistente

O componente `ARMessageSign.tsx` (linha 58) tenta carregar uma fonte que não existe:

```typescript
font="/fonts/Inter-Bold.woff"  // Este arquivo NÃO existe em public/
```

A pasta `public/` contém apenas:
- `favicon.ico`
- `placeholder.svg`
- `robots.txt`

**Impacto:** O componente `Text` do @react-three/drei falha silenciosamente ao tentar carregar a fonte, o que pode impedir a renderização completa do grupo 3D.

---

### Problema 2: RLS Bloqueando Perfil do Criador

A política RLS da tabela `profiles` permite apenas que usuários vejam seu **próprio** perfil:

```sql
-- Política atual:
Policy Name: Users can view their own profile
Using Expression: (auth.uid() = user_id)
```

Quando um usuário anônimo (sem autenticação) escaneia o QR Code, a query em `ARPreview.tsx`:

```typescript
const { data: profileData } = await supabase
  .from("profiles")
  .select("name, avatar_url, avatar_config")
  .eq("user_id", reminderData.user_id)
  .maybeSingle();
```

**Falha porque:** O usuário não está autenticado, então `auth.uid()` retorna `null`, e a política bloqueia o acesso.

**Impacto:** O `avatar_config` não é carregado, e o avatar usa a configuração padrão. Mas isso não impediria a renderização do avatar em si.

---

### Problema 3: Estado Inicial "start" (Menor)

O estado inicial de `ARExperience.tsx` é `"start"`, o que requer clicar no botão para ver o avatar. Você pediu que o avatar apareça imediatamente.

---

### Solução Proposta

#### 1. Remover Dependência da Fonte Externa

Modificar `ARMessageSign.tsx` para usar fonte padrão do sistema ou remover o atributo `font`:

```typescript
// Antes
<Text
  font="/fonts/Inter-Bold.woff"  // ❌ Não existe
  ...
>

// Depois - usar fonte padrão ou undefined
<Text
  // Remover atributo font para usar fonte padrão
  ...
>
```

---

#### 2. Adicionar Política RLS para Profiles Públicos

Criar nova política que permite leitura anônima apenas dos campos necessários para AR:

```sql
CREATE POLICY "Public can view avatar_config for AR"
  ON profiles FOR SELECT
  USING (true);  -- Permite leitura pública
```

**Alternativa mais segura:** Criar uma view pública apenas com os campos necessários.

---

#### 3. Iniciar Diretamente na Câmera

Modificar `ARExperience.tsx` para iniciar no estado `"camera"`:

```typescript
// Antes
const [arState, setArState] = useState<ARState>("start");

// Depois
const [arState, setArState] = useState<ARState>("camera");
```

---

### Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/components/ar/ARMessageSign.tsx` | Remover atributo `font` ou usar fonte inline |
| `src/components/ar/ARExperience.tsx` | Mudar estado inicial para `"camera"` |
| **Banco de dados** | Adicionar política RLS pública para profiles |

---

### Código das Correções

**1. ARMessageSign.tsx - Remover fonte problemática:**

```typescript
<Text
  position={[0, 0, 0.01]}
  fontSize={0.15}
  maxWidth={estimatedWidth}
  textAlign="center"
  anchorX="center"
  anchorY="middle"
  color="#1a1a2e"
  // Removido: font="/fonts/Inter-Bold.woff"
  outlineWidth={0}
>
  {message}
</Text>
```

**2. ARExperience.tsx - Iniciar na câmera:**

```typescript
const [arState, setArState] = useState<ARState>("camera");
```

**3. Nova política RLS para profiles (SQL):**

```sql
-- Permitir que qualquer pessoa veja perfis (para experiência AR)
CREATE POLICY "Anyone can view profiles for AR"
  ON profiles FOR SELECT
  USING (true);
```

---

### Ordem de Implementação

1. Corrigir fonte em `ARMessageSign.tsx` (causa mais provável do erro)
2. Alterar estado inicial em `ARExperience.tsx`
3. Adicionar política RLS para profiles (se necessário após testes)

---

### Resultado Esperado

Após as correções:
- O avatar 3D aparecerá imediatamente quando a câmera abrir
- A placa com a mensagem será renderizada corretamente
- A experiência funcionará para usuários anônimos

