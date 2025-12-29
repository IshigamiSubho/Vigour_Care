import { motion } from "framer-motion";
import { Clock, Calendar, MapPin, User } from "lucide-react";
import type { Doctor } from "@shared/schema";

interface DoctorCardProps {
  doctor: Doctor;
  distance?: number;
}

export function DoctorCard({ doctor, distance }: DoctorCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        {/* Doctor Image / Avatar */}
        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-muted flex items-center justify-center border-2 border-transparent group-hover:border-primary/20 transition-colors">
            {doctor.imageUrl ? (
              <img 
                src={doctor.imageUrl} 
                alt={doctor.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-muted-foreground/50" />
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-card p-1 rounded-full shadow-sm">
             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg text-foreground truncate pr-2">
            {doctor.name}
          </h3>
          <p className="text-primary font-medium text-sm mb-3">
            {doctor.specialty}
          </p>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{doctor.timing}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{doctor.days}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{doctor.address}</span>
            </div>
            {distance !== undefined && distance !== null && (
              <div className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full bg-accent/10 text-accent text-[10px] font-bold">
                {distance.toFixed(1)} km away
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
