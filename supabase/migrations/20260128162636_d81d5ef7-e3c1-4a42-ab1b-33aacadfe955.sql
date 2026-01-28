-- Criar tabela de visitas aos QR Codes
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