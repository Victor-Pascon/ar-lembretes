import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocations, Location } from "@/hooks/useLocations";
import { toast } from "@/hooks/use-toast";

interface LocationsManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LocationsManagementDialog({
  open,
  onOpenChange,
}: LocationsManagementDialogProps) {
  const { locations, isLoading, createLocation, updateLocation, deleteLocation } = useLocations();
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Location | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", address: "" });
  const [isSaving, setIsSaving] = useState(false);

  const handleStartCreate = () => {
    setFormData({ name: "", description: "", address: "" });
    setIsCreating(true);
    setEditingLocation(null);
  };

  const handleStartEdit = (location: Location) => {
    setFormData({
      name: location.name,
      description: location.description || "",
      address: location.address || "",
    });
    setEditingLocation(location);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingLocation(null);
    setFormData({ name: "", description: "", address: "" });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe o nome do local",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingLocation) {
        await updateLocation(editingLocation.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          address: formData.address.trim() || null,
        });
        toast({
          title: "Local atualizado",
          description: "As alterações foram salvas com sucesso",
        });
      } else {
        await createLocation({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          address: formData.address.trim() || null,
        });
        toast({
          title: "Local criado",
          description: "O novo local foi adicionado com sucesso",
        });
      }
      handleCancel();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o local",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteLocation(deleteConfirm.id);
      toast({
        title: "Local excluído",
        description: "O local foi removido com sucesso",
      });
      setDeleteConfirm(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o local. Verifique se não há lembretes vinculados.",
        variant: "destructive",
      });
    }
  };

  const isEditing = isCreating || editingLocation !== null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {isEditing ? (editingLocation ? "Editar Local" : "Novo Local") : "Meus Locais"}
            </DialogTitle>
          </DialogHeader>

          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Local *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Sala de Reuniões A"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço / Localização</Label>
                <Input
                  id="address"
                  placeholder="Ex: Bloco B, 2º andar"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição adicional do local..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                  {isSaving ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Button onClick={handleStartCreate} className="w-full" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Novo Local
              </Button>

              {isLoading ? (
                <div className="py-8 text-center text-muted-foreground">Carregando...</div>
              ) : locations.length === 0 ? (
                <div className="py-8 text-center">
                  <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">Nenhum local cadastrado</p>
                  <p className="text-sm text-muted-foreground/70">
                    Crie locais para organizar seus lembretes
                  </p>
                </div>
              ) : (
                <ScrollArea className="max-h-[300px]">
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{location.name}</h4>
                            {location.address && (
                              <p className="text-xs text-muted-foreground truncate">
                                {location.address}
                              </p>
                            )}
                            {location.description && (
                              <p className="text-xs text-muted-foreground/70 truncate mt-1">
                                {location.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleStartEdit(location)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteConfirm(location)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Local</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o local "{deleteConfirm?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
