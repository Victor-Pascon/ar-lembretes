import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Location = Tables<"locations">;
export type LocationInsert = TablesInsert<"locations">;

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLocations([]);
        return;
      }

      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch locations"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const createLocation = async (location: Omit<LocationInsert, "user_id">) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("locations")
      .insert({ ...location, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    await fetchLocations();
    return data;
  };

  const updateLocation = async (id: string, updates: Partial<Location>) => {
    const { data, error } = await supabase
      .from("locations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    await fetchLocations();
    return data;
  };

  const deleteLocation = async (id: string) => {
    const { error } = await supabase
      .from("locations")
      .delete()
      .eq("id", id);

    if (error) throw error;
    await fetchLocations();
  };

  return {
    locations,
    isLoading,
    error,
    createLocation,
    updateLocation,
    deleteLocation,
    refetch: fetchLocations,
  };
}
