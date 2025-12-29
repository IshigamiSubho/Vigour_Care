import { useMutation, useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DrugPrice } from "@shared/schema";

export function useDrugs(query: string) {
  return useQuery<DrugPrice[]>({
    queryKey: [api.drugs.search.path, { q: query }],
    enabled: !!query,
  });
}

export function useUpdateAvatar() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (avatarUrl: string) => {
      const res = await fetch(api.profile.updateAvatar.path, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl }),
      });
      if (!res.ok) throw new Error("Failed to update avatar");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "Profile picture updated" });
    },
  });
}
