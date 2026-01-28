import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import logoArLembretes from "@/assets/logo-ar-lembretes.png";
import { toast } from "@/hooks/use-toast";
import type { Session } from "@supabase/supabase-js";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ReminderList } from "@/components/reminders/ReminderList";
import { ReminderFormDialog } from "@/components/reminders/ReminderFormDialog";
import { LocationFormDialog } from "@/components/reminders/LocationFormDialog";
import { QRCodeCustomizerDialog } from "@/components/reminders/QRCodeCustomizerDialog";
import { useProfile } from "@/hooks/useProfile";
import { useReminders, type ReminderWithLocation } from "@/hooks/useReminders";
import { useLocations } from "@/hooks/useLocations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Dialogs state
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [qrCustomizerOpen, setQRCustomizerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [selectedReminder, setSelectedReminder] = useState<ReminderWithLocation | null>(null);
  const [reminderToDelete, setReminderToDelete] = useState<string | null>(null);

  // Hooks
  const { profile, isLoading: profileLoading } = useProfile();
  const { 
    reminders, 
    isLoading: remindersLoading, 
    createReminder, 
    updateReminder, 
    deleteReminder,
    toggleReminderStatus 
  } = useReminders();
  const { locations, isLoading: locationsLoading, createLocation } = useLocations();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handlers
  const handleCreateNew = () => {
    setSelectedReminder(null);
    setReminderDialogOpen(true);
  };

  const handleEdit = (reminder: ReminderWithLocation) => {
    setSelectedReminder(reminder);
    setReminderDialogOpen(true);
  };

  const handleCustomizeQR = (reminder: ReminderWithLocation) => {
    setSelectedReminder(reminder);
    setQRCustomizerOpen(true);
  };

  const handlePreviewAR = (reminder: ReminderWithLocation) => {
    window.open(`/ar/${reminder.qr_code_data}`, "_blank");
  };

  const handleDeleteClick = (id: string) => {
    setReminderToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reminderToDelete) return;
    try {
      await deleteReminder(reminderToDelete);
      toast({
        title: "Lembrete excluído",
        description: "O lembrete foi removido com sucesso.",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o lembrete.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setReminderToDelete(null);
    }
  };

  const handleReminderSubmit = async (data: {
    title: string;
    message: string;
    location_id?: string;
    is_active: boolean;
  }) => {
    try {
      if (selectedReminder) {
        await updateReminder(selectedReminder.id, data);
        toast({
          title: "Lembrete atualizado",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        await createReminder(data);
        toast({
          title: "Lembrete criado",
          description: "Seu novo lembrete foi criado com sucesso!",
        });
      }
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o lembrete.",
        variant: "destructive",
      });
      throw new Error("Failed to save reminder");
    }
  };

  const handleLocationSubmit = async (data: {
    name: string;
    description?: string;
    address?: string;
  }) => {
    try {
      await createLocation(data);
      toast({
        title: "Local criado",
        description: "O novo local foi adicionado com sucesso.",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível criar o local.",
        variant: "destructive",
      });
      throw new Error("Failed to create location");
    }
  };

  const handleQRStyleSave = async (id: string, style: { foreground: string; background: string }) => {
    try {
      await updateReminder(id, { qr_code_style: style });
      toast({
        title: "QR Code personalizado",
        description: "O estilo do QR Code foi atualizado.",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
      throw new Error("Failed to update QR style");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-auth-gradient">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-auth-gradient">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-8 p-8">
            <div className="flex justify-center">
              <img 
                src={logoArLembretes} 
                alt="AR Lembretes" 
                className="w-40 h-40 object-contain drop-shadow-2xl"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-primary-foreground">AR Lembretes</h1>
              <p className="text-lg text-auth-muted max-w-md">
                Sistema de Lembretes com Realidade Aumentada via QR Codes
              </p>
            </div>
            <Button
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-glow"
            >
              Acessar Painel de Administração
            </Button>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="py-4 text-center text-auth-muted text-sm">
          © {new Date().getFullYear()} AR Lembretes. By João Victor A.S Pascon
        </footer>
      </div>
    );
  }

  const activeReminders = reminders.filter((r) => r.is_active).length;
  const dataLoading = profileLoading || remindersLoading || locationsLoading;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader profile={profile} onProfileUpdate={() => window.location.reload()} />

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Stats */}
        <DashboardStats
          totalReminders={reminders.length}
          activeReminders={activeReminders}
          totalLocations={locations.length}
          isLoading={dataLoading}
        />

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Meus Lembretes</h2>
            <p className="text-muted-foreground">
              Gerencie seus lembretes e QR Codes em um só lugar
            </p>
          </div>
          <Button 
            onClick={handleCreateNew}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar novo lembrete
          </Button>
        </div>

        {/* Reminders List */}
        <ReminderList
          reminders={reminders}
          isLoading={dataLoading}
          onEdit={handleEdit}
          onCustomizeQR={handleCustomizeQR}
          onPreviewAR={handlePreviewAR}
          onDelete={handleDeleteClick}
          onToggleStatus={toggleReminderStatus}
          onCreateNew={handleCreateNew}
        />
      </main>

      {/* Dialogs */}
      <ReminderFormDialog
        open={reminderDialogOpen}
        onOpenChange={setReminderDialogOpen}
        reminder={selectedReminder}
        locations={locations}
        onSubmit={handleReminderSubmit}
        onCreateLocation={() => setLocationDialogOpen(true)}
      />

      <LocationFormDialog
        open={locationDialogOpen}
        onOpenChange={setLocationDialogOpen}
        onSubmit={handleLocationSubmit}
      />

      <QRCodeCustomizerDialog
        open={qrCustomizerOpen}
        onOpenChange={setQRCustomizerOpen}
        reminder={selectedReminder}
        onSave={handleQRStyleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir lembrete?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O lembrete e seu QR Code serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground text-sm border-t border-border mt-8">
        © {new Date().getFullYear()} AR Lembretes. By João Victor A.S Pascon
      </footer>
    </div>
  );
};

export default Index;
