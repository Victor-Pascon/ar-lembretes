import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import type { ReminderWithLocation } from "@/hooks/useReminders";
import type { Location } from "@/hooks/useLocations";

const reminderSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres").max(100, "Título deve ter no máximo 100 caracteres"),
  message: z.string().min(10, "Mensagem deve ter no mínimo 10 caracteres").max(500, "Mensagem deve ter no máximo 500 caracteres"),
  location_id: z.string().optional(),
  is_active: z.boolean().default(true),
});

type ReminderFormData = z.infer<typeof reminderSchema>;

interface ReminderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder?: ReminderWithLocation | null;
  locations: Location[];
  onSubmit: (data: ReminderFormData) => Promise<void>;
  onCreateLocation: () => void;
}

export function ReminderFormDialog({
  open,
  onOpenChange,
  reminder,
  locations,
  onSubmit,
  onCreateLocation,
}: ReminderFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!reminder;

  const form = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: "",
      message: "",
      location_id: undefined,
      is_active: true,
    },
  });

  useEffect(() => {
    if (reminder) {
      form.reset({
        title: reminder.title,
        message: reminder.message,
        location_id: reminder.location_id || undefined,
        is_active: reminder.is_active,
      });
    } else {
      form.reset({
        title: "",
        message: "",
        location_id: undefined,
        is_active: true,
      });
    }
  }, [reminder, form]);

  const handleSubmit = async (data: ReminderFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Lembrete" : "Criar Novo Lembrete"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Lembrete da Sala de Reuniões" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem AR</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mensagem que será exibida em realidade aumentada..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local físico</FormLabel>
                  <div className="flex gap-2">
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecione um local" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="icon" onClick={onCreateLocation}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <FormLabel className="text-sm font-medium">Ativo</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Quando ativo, o QR Code estará funcional
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditing ? "Salvar alterações" : "Criar lembrete"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
