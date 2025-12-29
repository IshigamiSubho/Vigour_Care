import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useDoctors() {
  return useQuery({
    queryKey: [api.doctors.list.path],
    queryFn: async () => {
      const res = await fetch(api.doctors.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch doctors");
      return api.doctors.list.responses[200].parse(await res.json());
    },
  });
}

export function useDoctor(id: number) {
  return useQuery({
    queryKey: [api.doctors.get.path, id],
    queryFn: async () => {
      const res = await fetch(api.doctors.get.path.replace(':id', String(id)), { 
        credentials: "include" 
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch doctor");
      return api.doctors.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
