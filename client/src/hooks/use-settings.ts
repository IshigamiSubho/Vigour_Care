import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export function useSettings() {
  return useQuery({
    queryKey: [api.settings.get.path],
    queryFn: async () => {
      const res = await fetch(api.settings.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch settings");
      return api.settings.get.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (location: z.infer<typeof api.settings.updateLocation.input>) => {
      const res = await fetch(api.settings.updateLocation.path, {
        method: api.settings.updateLocation.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(location),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.settings.updateLocation.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to update location");
      }
      
      return api.settings.updateLocation.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.settings.get.path] });
      toast({
        title: "Location Updated",
        description: "Your location has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Could not update location",
        variant: "destructive",
      });
    },
  });
}

export function useToggleTheme() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (theme: 'light' | 'dark') => {
      const res = await fetch(api.settings.toggleTheme.path, {
        method: api.settings.toggleTheme.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update theme");
      return api.settings.toggleTheme.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.settings.get.path], data);
      // Apply theme immediately to DOM
      if (data.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  });
}
