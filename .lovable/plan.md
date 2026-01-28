

## Configurações de Conta e Dashboard de Analytics

### Visao Geral

Este plano aborda duas funcionalidades principais:

1. **Menu de Configurações** - Implementar dialog funcional para alterar nome, email e senha
2. **Dashboard de Analytics** - Criar sistema de rastreamento de visitas aos QR Codes com gráficos

---

### Parte 1: Menu de Configurações

#### Problema Atual

O botão "Configurações" no menu não possui um handler `onClick`, apenas renderiza o ícone e texto:

```typescript
// Linha 98-101 do DashboardHeader.tsx (atual)
<DropdownMenuItem>
  <Settings className="w-4 h-4 mr-2" />
  Configurações
</DropdownMenuItem>
```

#### Novo Componente: SettingsDialog

Interface com abas para cada tipo de configuração:

```text
+--------------------------------------------------+
|  Configurações da Conta                   [X]    |
+--------------------------------------------------+
|  [Perfil]  [Email]  [Senha]                      |
+--------------------------------------------------+
|                                                  |
|  -- PERFIL (aba selecionada) --                  |
|                                                  |
|  Nome                                            |
|  [João Victor Almeida Santos Pascon    ]         |
|                                                  |
|  [Salvar Alterações]                             |
|                                                  |
+--------------------------------------------------+
```

```text
+--------------------------------------------------+
|  Configurações da Conta                   [X]    |
+--------------------------------------------------+
|  [Perfil]  [Email]  [Senha]                      |
+--------------------------------------------------+
|                                                  |
|  -- EMAIL (aba selecionada) --                   |
|                                                  |
|  Email atual: joaovpascon@gmail.com              |
|                                                  |
|  Novo Email                                      |
|  [                                      ]        |
|                                                  |
|  Senha atual (confirmação)                       |
|  [                                      ]        |
|                                                  |
|  [Alterar Email]                                 |
|                                                  |
|  ⚠️ Um email de confirmação será enviado         |
|                                                  |
+--------------------------------------------------+
```

```text
+--------------------------------------------------+
|  Configurações da Conta                   [X]    |
+--------------------------------------------------+
|  [Perfil]  [Email]  [Senha]                      |
+--------------------------------------------------+
|                                                  |
|  -- SENHA (aba selecionada) --                   |
|                                                  |
|  Senha atual                                     |
|  [••••••••                              ]        |
|                                                  |
|  Nova senha                                      |
|  [                                      ]        |
|  [Indicador de força da senha]                   |
|                                                  |
|  Confirmar nova senha                            |
|  [                                      ]        |
|                                                  |
|  [Alterar Senha]                                 |
|                                                  |
+--------------------------------------------------+
```

#### Funcoes do Supabase Auth Utilizadas

```typescript
// Alterar nome (profiles table)
const updateName = async (newName: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");
  
  const { error } = await supabase
    .from("profiles")
    .update({ name: newName })
    .eq("user_id", user.id);
    
  if (error) throw error;
};

// Alterar email (necessita confirmação)
const updateEmail = async (newEmail: string) => {
  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  });
  if (error) throw error;
  // Email de confirmação será enviado automaticamente
};

// Alterar senha
const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
};
```

#### Arquivos a Criar/Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/components/settings/SettingsDialog.tsx` | NOVO - Dialog principal com abas |
| `src/components/settings/ProfileSettings.tsx` | NOVO - Aba de perfil (nome) |
| `src/components/settings/EmailSettings.tsx` | NOVO - Aba de alteração de email |
| `src/components/settings/PasswordSettings.tsx` | NOVO - Aba de alteração de senha |
| `src/components/dashboard/DashboardHeader.tsx` | Adicionar onClick e state para SettingsDialog |

---

### Parte 2: Dashboard de Analytics

#### Estrutura de Dados

Criar nova tabela `qr_visits` para rastrear visualizações:

```sql
CREATE TABLE public.qr_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id UUID NOT NULL REFERENCES public.reminders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- Dono do QR (para RLS)
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  view_mode TEXT, -- 'card' | 'ar' | 'select'
  user_agent TEXT, -- Navegador/dispositivo
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para que donos vejam apenas suas visitas
ALTER TABLE public.qr_visits ENABLE ROW LEVEL SECURITY;

-- Política de INSERT público (qualquer um pode registrar visita)
CREATE POLICY "Anyone can insert visits"
  ON public.qr_visits FOR INSERT
  WITH CHECK (true);

-- Política de SELECT para donos
CREATE POLICY "Users can view visits to their reminders"
  ON public.qr_visits FOR SELECT
  USING (auth.uid() = user_id);
```

#### Fluxo de Registro de Visitas

Quando alguém acessa `/ar/:reminderId`:

```typescript
// Em ARPreview.tsx, após carregar o reminder:
const logVisit = async (reminderId: string, userId: string, viewMode: string) => {
  await supabase.from("qr_visits").insert({
    reminder_id: reminderId,
    user_id: userId, // ID do DONO do QR, não do visitante
    view_mode: viewMode,
    user_agent: navigator.userAgent,
  });
};
```

#### Nova Página: Analytics Dashboard

Criar nova rota `/analytics` ou usar abas na página principal:

```text
+------------------------------------------------------------------+
|  [Logo]  AR Lembretes                              [Menu Usuario] |
+------------------------------------------------------------------+
|                                                                  |
|  [Meus Lembretes]  [Analytics]  <-- Toggle/Tabs                  |
|                                                                  |
+------------------------------------------------------------------+
|                                                                  |
|  Visão Geral dos QR Codes                                        |
|                                                                  |
|  +-------------+  +-------------+  +-------------+               |
|  | Total de    |  | Visitas     |  | Média por   |               |
|  | Visitas     |  | Este Mês    |  | QR Code     |               |
|  |   247       |  |    89       |  |   12.3      |               |
|  +-------------+  +-------------+  +-------------+               |
|                                                                  |
|  Visitas nos Últimos 30 Dias                                     |
|  +----------------------------------------------------------+    |
|  |     ^                                                    |    |
|  |  25 |        ____                                        |    |
|  |     |   ____/    \____                                   |    |
|  |  15 |__/               \____        ____                 |    |
|  |     |                       \______/    \____            |    |
|  |   5 |                                        \____       |    |
|  |     +---------------------------------------------->     |    |
|  |       Jan 1   Jan 8   Jan 15   Jan 22   Jan 28          |    |
|  +----------------------------------------------------------+    |
|                                                                  |
|  Estatísticas por QR Code                                        |
|                                                                  |
|  +----------------------------------------------------------+    |
|  | QR Code           | Local      | Visitas | Última Visita |    |
|  +-------------------+------------+---------+---------------+    |
|  | Boas Vindas       | Modok Lab  |   45    | Há 2 horas    |    |
|  | Limpar Cafeteira  | Cafeteira  |   32    | Há 5 minutos  |    |
|  +----------------------------------------------------------+    |
|                                                                  |
|  [Ver Detalhes] para cada QR individual                          |
|                                                                  |
+------------------------------------------------------------------+
```

#### Modal de Detalhes por QR Code

```text
+--------------------------------------------------+
|  Estatísticas: Boas Vindas                [X]    |
+--------------------------------------------------+
|                                                  |
|  Local: Modok Lab                                |
|  Total de Visitas: 45                            |
|                                                  |
|  Gráfico de Visitas (7 dias)                     |
|  +--------------------------------------------+  |
|  |     _____                                  |  |
|  |    /     \                                 |  |
|  | __/       \_____          _____            |  |
|  |                  \________/                |  |
|  +--------------------------------------------+  |
|                                                  |
|  Modo de Visualização                            |
|  +--------------------------------------------+  |
|  |  [====== Card 60% ======]                  |  |
|  |  [=== AR 40% ===]                          |  |
|  +--------------------------------------------+  |
|                                                  |
|  Dispositivos                                    |
|  • Mobile: 78%                                   |
|  • Desktop: 22%                                  |
|                                                  |
+--------------------------------------------------+
```

#### Hook useAnalytics

```typescript
interface VisitStats {
  totalVisits: number;
  visitsThisMonth: number;
  avgPerQR: number;
  visitsByDay: { date: string; count: number }[];
  visitsByQR: {
    reminderId: string;
    title: string;
    location: string | null;
    totalVisits: number;
    lastVisit: string | null;
  }[];
}

export function useAnalytics() {
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Buscar todas as visitas do usuário
    const { data: visits } = await supabase
      .from("qr_visits")
      .select(`
        *,
        reminders (
          id,
          title,
          locations (name)
        )
      `)
      .eq("user_id", user.id)
      .order("visited_at", { ascending: false });

    // Processar dados para estatísticas
    // ...
  };

  return { stats, isLoading, refetch: fetchStats };
}
```

#### Arquivos a Criar

| Arquivo | Descrição |
|---------|-----------|
| `src/pages/Analytics.tsx` | Página principal de analytics |
| `src/hooks/useAnalytics.ts` | Hook para buscar e processar dados |
| `src/components/analytics/OverviewStats.tsx` | Cards com totais |
| `src/components/analytics/VisitsChart.tsx` | Gráfico de linha (recharts) |
| `src/components/analytics/QRCodeTable.tsx` | Tabela com stats por QR |
| `src/components/analytics/QRDetailDialog.tsx` | Modal com detalhes |

#### Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/pages/ARPreview.tsx` | Adicionar logVisit() ao carregar QR |
| `src/pages/Index.tsx` | Adicionar tabs ou link para Analytics |
| `src/App.tsx` | Adicionar rota `/analytics` |
| `src/components/dashboard/DashboardHeader.tsx` | Adicionar link Dashboard no menu |

---

### Migração de Banco de Dados

```sql
-- Criar tabela de visitas
CREATE TABLE public.qr_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id UUID NOT NULL REFERENCES public.reminders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  view_mode TEXT CHECK (view_mode IN ('select', 'card', 'ar')),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_qr_visits_reminder_id ON public.qr_visits(reminder_id);
CREATE INDEX idx_qr_visits_user_id ON public.qr_visits(user_id);
CREATE INDEX idx_qr_visits_visited_at ON public.qr_visits(visited_at);

-- Habilitar RLS
ALTER TABLE public.qr_visits ENABLE ROW LEVEL SECURITY;

-- Política de INSERT (público - visitantes anônimos podem registrar)
CREATE POLICY "Anyone can insert visits"
  ON public.qr_visits FOR INSERT
  WITH CHECK (true);

-- Política de SELECT (apenas donos veem suas visitas)
CREATE POLICY "Users can view visits to their reminders"
  ON public.qr_visits FOR SELECT
  USING (auth.uid() = user_id);
```

---

### Gráficos com Recharts

Usar a biblioteca recharts já instalada:

```typescript
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Dados processados
const chartData = [
  { date: "Jan 22", visits: 12 },
  { date: "Jan 23", visits: 8 },
  { date: "Jan 24", visits: 15 },
  // ...
];

// Componente
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line 
      type="monotone" 
      dataKey="visits" 
      stroke="#7c3aed" 
      strokeWidth={2}
    />
  </LineChart>
</ResponsiveContainer>
```

---

### Resumo das Mudanças

#### Configurações (Parte 1)

| Tipo | Arquivo |
|------|---------|
| NOVO | `src/components/settings/SettingsDialog.tsx` |
| NOVO | `src/components/settings/ProfileSettings.tsx` |
| NOVO | `src/components/settings/EmailSettings.tsx` |
| NOVO | `src/components/settings/PasswordSettings.tsx` |
| MOD | `src/components/dashboard/DashboardHeader.tsx` |

#### Analytics (Parte 2)

| Tipo | Arquivo |
|------|---------|
| NOVO | `src/pages/Analytics.tsx` |
| NOVO | `src/hooks/useAnalytics.ts` |
| NOVO | `src/components/analytics/OverviewStats.tsx` |
| NOVO | `src/components/analytics/VisitsChart.tsx` |
| NOVO | `src/components/analytics/QRCodeTable.tsx` |
| NOVO | `src/components/analytics/QRDetailDialog.tsx` |
| MOD | `src/pages/ARPreview.tsx` - log de visitas |
| MOD | `src/pages/Index.tsx` - tabs/link |
| MOD | `src/App.tsx` - rota /analytics |
| MOD | `src/components/dashboard/DashboardHeader.tsx` - menu |
| DB | Criar tabela `qr_visits` + RLS |

---

### Benefícios

1. **Configurações Funcionais** - Usuários podem atualizar seus dados de conta
2. **Insights de Uso** - Donos de QR Codes sabem quantas pessoas acessaram
3. **Decisões Baseadas em Dados** - Identificar QR Codes mais/menos populares
4. **Segurança** - Visitantes são anônimos, apenas totais são mostrados

