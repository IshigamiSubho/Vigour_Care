import logo from "@assets/vc_1766993579360.png";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Activity, Users } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 flex flex-col relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

      {/* Nav */}
      <nav className="relative z-10 p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <img src={logo} alt="VigourCare Logo" className="h-10 w-auto" />
          <span className="font-display font-bold text-2xl text-foreground hidden sm:block">
            VigourCare
          </span>
        </div>
        <button 
          onClick={handleLogin}
          className="px-5 py-2.5 rounded-full font-semibold text-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-border hover:bg-white hover:shadow-md transition-all text-foreground"
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 max-w-4xl mx-auto w-full py-12 md:py-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Activity className="w-3.5 h-3.5" />
            <span>Healthcare Simplified</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-extrabold text-foreground tracking-tight leading-[1.1]">
            Find the right <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              Specialist
            </span> for you.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect with top doctors, check availability, and manage your appointments seamlessly. Your health journey starts here.
          </p>

          <div className="pt-8">
            <button 
              onClick={handleLogin}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
            >
              Get Started with Google
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full text-left"
        >
          <FeatureCard 
            icon={<Users className="w-6 h-6 text-primary" />}
            title="Top Specialists"
            desc="Access a curated network of verified healthcare professionals."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-accent" />}
            title="Secure & Private"
            desc="Your health data is encrypted and protected at all times."
          />
          <FeatureCard 
            icon={<Activity className="w-6 h-6 text-green-500" />}
            title="Smart Matching"
            desc="Find doctors nearby based on your location and needs."
          />
        </motion.div>

      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground relative z-10">
        © {new Date().getFullYear()} VigourCare. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all">
      <div className="bg-background rounded-xl w-12 h-12 flex items-center justify-center mb-4 shadow-sm">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
