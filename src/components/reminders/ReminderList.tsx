import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, LayoutGrid, List, Bell, Plus } from "lucide-react";
import { ReminderCard } from "./ReminderCard";
import { EmptyState } from "./EmptyState";
import type { ReminderWithLocation } from "@/hooks/useReminders";

interface ReminderListProps {
  reminders: ReminderWithLocation[];
  isLoading: boolean;
  onEdit: (reminder: ReminderWithLocation) => void;
  onCustomizeQR: (reminder: ReminderWithLocation) => void;
  onPreviewAR: (reminder: ReminderWithLocation) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onCreateNew: () => void;
}

type FilterStatus = "all" | "active" | "inactive";
type ViewMode = "grid" | "list";

export function ReminderList({
  reminders,
  isLoading,
  onEdit,
  onCustomizeQR,
  onPreviewAR,
  onDelete,
  onToggleStatus,
  onCreateNew,
}: ReminderListProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredReminders = reminders.filter((reminder) => {
    const matchesSearch =
      reminder.title.toLowerCase().includes(search.toLowerCase()) ||
      reminder.message.toLowerCase().includes(search.toLowerCase()) ||
      reminder.locations?.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && reminder.is_active) ||
      (filterStatus === "inactive" && !reminder.is_active);

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Skeleton className="h-10 w-full sm:w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-4 space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="Nenhum lembrete criado"
        description="Comece criando seu primeiro lembrete AR associado a um QR Code único."
        actionLabel="Criar primeiro lembrete"
        onAction={onCreateNew}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar lembretes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center border border-input rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none h-9 w-9"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none h-9 w-9"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredReminders.length} de {reminders.length} lembretes
        </p>
        <Button onClick={onCreateNew} size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
          <Plus className="w-4 h-4 mr-1" />
          Novo lembrete
        </Button>
      </div>

      {/* Empty filtered state */}
      {filteredReminders.length === 0 && reminders.length > 0 && (
        <EmptyState
          icon={Search}
          title="Nenhum resultado encontrado"
          description="Tente ajustar os filtros ou termos de busca."
        />
      )}

      {/* Grid/List View */}
      {filteredReminders.length > 0 && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "flex flex-col gap-4"
          }
        >
          {filteredReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onEdit={onEdit}
              onCustomizeQR={onCustomizeQR}
              onPreviewAR={onPreviewAR}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
