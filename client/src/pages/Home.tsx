import { useDoctors } from "@/hooks/use-doctors";
import { useSettings } from "@/hooks/use-settings";
import { useAuth } from "@/hooks/use-auth";
import { DoctorCard } from "@/components/DoctorCard";
import { Navigation } from "@/components/Navigation";
import { Search, MapPinOff } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

// Helper for Haversine distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export default function Home() {
  const { user } = useAuth();
  const { data: doctors, isLoading: loadingDoctors } = useDoctors();
  const { data: settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = doctors?.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  ).map(doc => ({
    ...doc,
    distance: (settings?.locationLat && settings?.locationLng) 
      ? calculateDistance(settings.locationLat, settings.locationLng, doc.latitude, doc.longitude)
      : undefined
  })).sort((a, b) => {
    // Sort by distance if available
    if (a.distance !== undefined && b.distance !== undefined) {
      return a.distance - b.distance;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-6 md:pt-24 space-y-8">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Welcome back,</p>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {user?.firstName || "Patient"}
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {user?.firstName?.[0]}
          </div>
        </div>

        {/* Search Header */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search doctor or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-card border-2 border-transparent focus:border-primary/20 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm shadow-slate-200/50 dark:shadow-black/20 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Content */}
        {loadingDoctors ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card h-48 rounded-2xl animate-pulse bg-muted/50" />
            ))}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-display">Specialists Nearby</h2>
              {settings?.locationName && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  Near {settings.locationName}
                </span>
              )}
            </div>
            
            {!settings?.locationLat && (
              <div className="mb-6 bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-3 text-sm text-accent-foreground">
                <MapPinOff className="w-5 h-5 shrink-0" />
                <p>Location not set. Distances will not be shown. Go to Settings to enable.</p>
              </div>
            )}

            {filteredDoctors && filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard 
                    key={doctor.id} 
                    doctor={doctor} 
                    distance={doctor.distance}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <p>No doctors found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
