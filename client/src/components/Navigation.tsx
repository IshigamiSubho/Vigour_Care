import { Link, useLocation } from "wouter";
import { Home, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-50 px-6 py-3 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 font-display font-bold text-xl text-primary">
          <span>VigourCare</span>
        </div>

        <div className="flex items-center justify-around w-full md:w-auto md:gap-8">
          <Link href="/">
            <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors cursor-pointer ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-medium">Home</span>
              {isActive('/') && (
                <motion.div layoutId="nav-indicator" className="absolute -bottom-3 md:-bottom-3.5 w-1 h-1 bg-primary rounded-full" />
              )}
            </div>
          </Link>

          <Link href="/settings">
            <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors cursor-pointer ${isActive('/settings') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              <Settings className="w-6 h-6" />
              <span className="text-[10px] font-medium">Settings</span>
              {isActive('/settings') && (
                <motion.div layoutId="nav-indicator" className="absolute -bottom-3 md:-bottom-3.5 w-1 h-1 bg-primary rounded-full" />
              )}
            </div>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            {user?.firstName} {user?.lastName}
          </span>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
        </div>
      </div>
    </nav>
  );
}
