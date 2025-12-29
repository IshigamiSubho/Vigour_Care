import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { useSettings, useToggleTheme, useUpdateLocation } from "@/hooks/use-settings";
import { useUpdateAvatar } from "@/hooks/use-drugs";
import { LogOut, Moon, Sun, MapPin, Loader2, Navigation as NavIcon, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Settings() {
  const { user, logout, isLoggingOut } = useAuth();
  const { data: settings, isLoading: loadingSettings } = useSettings();
  const updateLocation = useUpdateLocation();
  const toggleTheme = useToggleTheme();
  const updateAvatar = useUpdateAvatar();

  const handleAvatarUpload = () => {
    const url = prompt("Enter profile picture URL:");
    if (url) updateAvatar.mutate(url);
  };
  
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Sync theme with system on load if not set
  useEffect(() => {
    if (settings?.theme) {
      if (settings.theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [settings?.theme]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocation.mutate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: "Current Location (Detected)"
        });
        setDetectingLocation(false);
      },
      (error) => {
        console.error(error);
        setDetectingLocation(false);
        alert("Unable to retrieve your location");
      }
    );
  };

  if (loadingSettings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <Navigation />
      
      <main className="max-w-2xl mx-auto px-4 md:px-6 pt-6 md:pt-24 space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and account</p>
        </div>

        {/* Profile Section */}
        <section className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} className="w-full h-full object-cover" />
                ) : (
                  <>{user?.firstName?.[0]}{user?.lastName?.[0]}</>
                )}
              </div>
              <button 
                onClick={handleAvatarUpload}
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user?.firstName} {user?.lastName}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </section>

        {/* App Settings */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider ml-1">App Preferences</h3>
          
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Theme Toggle */}
            <div className="p-4 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  {settings?.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold text-foreground">Appearance</p>
                  <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
                </div>
              </div>
              
              <button
                onClick={() => toggleTheme.mutate(settings?.theme === 'light' ? 'dark' : 'light')}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  settings?.theme === 'dark' ? 'bg-primary' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`${
                    settings?.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            {/* Location Setting */}
            <div className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Location</p>
                    <p className="text-xs text-muted-foreground">Used to calculate distance to doctors</p>
                  </div>
                </div>
              </div>

              <div className="pl-[52px]">
                {settings?.locationName && (
                  <div className="mb-3 text-sm font-medium text-foreground bg-muted/50 px-3 py-2 rounded-lg border border-border">
                    Current: {settings.locationName}
                  </div>
                )}
                
                <button
                  onClick={handleDetectLocation}
                  disabled={detectingLocation || updateLocation.isPending}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {detectingLocation || updateLocation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <NavIcon className="w-4 h-4" />
                      Detect My Location
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Danger Zone / Logout */}
        <section className="space-y-4">
          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="w-full bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 p-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {isLoggingOut ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
            Log Out
          </button>
        </section>
      </main>
    </div>
  );
}
