import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Reminder = Tables<"reminders">;
export type ReminderInsert = TablesInsert<"reminders">;

export interface ReminderWithLocation extends Reminder {
  locations?: {
    id: string;
    name: string;
    address: string | null;
  } | null;
}

export function useReminders() {
  const [reminders, setReminders] = useState<ReminderWithLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReminders = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setReminders([]);
        return;
      }

      const { data, error } = await supabase
        .from("reminders")
        .select(`
          *,
          locations (
            id,
            name,
            address
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReminders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch reminders"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const createReminder = async (reminder: Omit<ReminderInsert, "user_id" | "qr_code_data">) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const qrCodeData = crypto.randomUUID();

    const { data, error } = await supabase
      .from("reminders")
      .insert({ 
        ...reminder, 
        user_id: user.id,
        qr_code_data: qrCodeData 
      })
      .select()
      .single();

    if (error) throw error;
    await fetchReminders();
    return data;
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    const { data, error } = await supabase
      .from("reminders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    await fetchReminders();
    return data;
  };

  const deleteReminder = async (id: string) => {
    const { error } = await supabase
      .from("reminders")
      .delete()
      .eq("id", id);

    if (error) throw error;
    await fetchReminders();
  };

  const toggleReminderStatus = async (id: string, isActive: boolean) => {
    return updateReminder(id, { is_active: isActive });
  };

  return {
    reminders,
    isLoading,
    error,
    createReminder,
    updateReminder,
    deleteReminder,
    toggleReminderStatus,
    refetch: fetchReminders,
  };
}
