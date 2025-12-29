import { Link, useLocation } from "wouter";
import { Home, Settings, LogOut, Pill, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "@assets/vc_1766993579360.png";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location === path;

  const navItems = [
    { href: "/", icon: Home, label: "Doctors" },
    { href: "/prices", icon: Pill, label: "Consumer Prices" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-50 px-6 py-3 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src={logo} alt="VigourCare Logo" className="h-12 w-auto" />
            <span className="hidden md:block font-display font-bold text-2xl text-primary">
              VigourCare
            </span>
          </div>
        </Link>

        <div className="flex items-center justify-around w-full md:w-auto md:gap-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-colors cursor-pointer ${isActive(item.href) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                <item.icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive(item.href) && (
                  <motion.div layoutId="nav-indicator" className="absolute -bottom-3 md:-bottom-3.5 w-1 h-1 bg-primary rounded-full" />
                )}
              </div>
            </Link>
          ))}
          
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors cursor-pointer ${isActive('/settings') ? 'text-primary' : 'text-muted-foreground'}`}>
                  <User className="w-6 h-6" />
                  <span className="text-[10px] font-medium">Profile</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mb-4">
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <div className="flex items-center gap-2 w-full">
                      <Settings className="w-4 h-4" />
                      Settings
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-muted transition-colors">
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarImage src={user?.avatarUrl || user?.profileImageUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-bold leading-none">{user?.firstName} {user?.lastName}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <div className="flex items-center gap-2 w-full cursor-pointer">
                    <Settings className="w-4 h-4" />
                    Settings
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
