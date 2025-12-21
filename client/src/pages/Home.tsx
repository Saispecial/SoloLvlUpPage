import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Sword, Shield, Zap, TrendingUp, ChevronDown, Send, ExternalLink, Menu, X } from "lucide-react";
import { api, type ContactInput } from "@shared/routes";
import { useCreateContact } from "@/hooks/use-contact";
import { NeonButton } from "@/components/NeonButton";
import { ParallaxCharacter } from "@/components/ParallaxCharacter";
import { SystemAlert } from "@/components/SystemAlert";

// --- Components for sections ---

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 h-16 md:h-20">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-sm rotate-45 flex items-center justify-center">
            <span className="text-black font-bold -rotate-45">S</span>
          </div>
          <span className="text-xl md:text-2xl font-display font-bold tracking-wider text-white">
            SOLO<span className="text-primary">LVL</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "Dashboard", "Contact"].map((item) => (
            <button 
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className="text-sm font-mono uppercase tracking-widest text-gray-400 hover:text-primary transition-colors hover:text-glow"
            >
              {item}
            </button>
          ))}
          <NeonButton onClick={() => window.open('https://forms.google.com', '_blank')} className="px-6 py-2 text-sm">
            Join Guild
          </NeonButton>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black border-b border-primary/20 p-6 flex flex-col gap-4 md:hidden">
          {["Features", "Dashboard", "Contact"].map((item) => (
            <button 
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className="text-left text-lg font-mono uppercase tracking-widest text-gray-300"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Abstract cyber grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        
        {/* Glow orb */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />
        
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ y: y1 }}
        >
          <div className="inline-block mb-4 px-4 py-1 border border-primary/30 bg-primary/5 rounded-full backdrop-blur-sm">
            <span className="text-primary font-mono text-xs tracking-[0.2em] uppercase">System Notification</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 mb-6 drop-shadow-2xl">
            AWAKEN<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">YOUR POWER</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-mono mb-10 leading-relaxed">
            Track your daily quests, rank up your stats, and become the S-Rank hunter you were meant to be.
            The System is waiting.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <NeonButton onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Accept Quest
            </NeonButton>
            <button className="text-white/70 hover:text-white font-mono uppercase tracking-widest text-sm flex items-center gap-2 group transition-colors">
              View Demo
              <span className="block w-2 h-2 border-r border-t border-current rotate-45 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary/50 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
        <ChevronDown />
      </motion.div>
    </section>
  );
}

function DashboardSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="dashboard" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl mb-4 text-white">Player <span className="text-primary">Interface</span></h2>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
        </div>

        <div ref={ref} className="relative perspective-[2000px]">
          {/* Main Interface Card */}
          <motion.div
            initial={{ rotateX: 20, opacity: 0, y: 100 }}
            animate={isInView ? { rotateX: 0, opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, type: "spring" }}
            className="w-full max-w-5xl mx-auto bg-card border border-white/10 rounded-xl overflow-hidden shadow-2xl box-glow"
          >
             {/* Fake UI Header */}
             <div className="h-12 bg-black/50 border-b border-white/10 flex items-center px-4 gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/50" />
               <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
               <div className="w-3 h-3 rounded-full bg-green-500/50" />
               <div className="ml-auto text-xs font-mono text-gray-500">SYSTEM.EXE</div>
             </div>
             
             {/* Fake UI Content - using abstract shapes instead of screenshot */}
             <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-br from-gray-900 to-black h-[500px]">
               {/* Sidebar */}
               <div className="col-span-1 border border-primary/20 bg-primary/5 rounded p-4 flex flex-col gap-4">
                 <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto border-2 border-primary mb-4" />
                 <div className="space-y-2">
                   <div className="h-4 bg-primary/20 rounded w-full" />
                   <div className="h-4 bg-primary/10 rounded w-3/4" />
                   <div className="h-4 bg-primary/10 rounded w-1/2" />
                 </div>
                 <div className="mt-auto p-4 bg-black/40 rounded border border-white/5">
                   <div className="text-xs text-primary font-mono mb-2">STATUS: HEALTHY</div>
                   <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                     <div className="h-full w-[80%] bg-primary" />
                   </div>
                 </div>
               </div>
               
               {/* Main Area */}
               <div className="col-span-1 md:col-span-2 grid grid-rows-2 gap-6">
                 <div className="border border-white/10 bg-white/5 rounded p-6 relative overflow-hidden">
                   <h3 className="text-xl font-display text-white mb-4">Daily Quest: Strength Training</h3>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-black/40 p-4 rounded">
                       <div className="text-2xl text-white font-bold">100</div>
                       <div className="text-xs text-gray-400">PUSH-UPS</div>
                     </div>
                     <div className="bg-black/40 p-4 rounded">
                       <div className="text-2xl text-white font-bold">10km</div>
                       <div className="text-xs text-gray-400">RUNNING</div>
                     </div>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="border border-white/10 bg-white/5 rounded" />
                    <div className="border border-white/10 bg-white/5 rounded" />
                 </div>
               </div>
             </div>
          </motion.div>

          {/* Floating Elements behind */}
          <div className="absolute top-1/2 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-10" />
          <div className="absolute bottom-0 -right-20 w-72 h-72 bg-secondary/10 rounded-full blur-[100px] -z-10" />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative bg-card border border-white/10 p-8 rounded-xl hover:border-primary/50 transition-colors duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 bg-black border border-primary/30 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all duration-300">
          <Icon className="text-white group-hover:text-primary transition-colors" size={24} />
        </div>
        
        <h3 className="text-2xl text-white mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-400 leading-relaxed font-mono text-sm">{desc}</p>
      </div>
    </motion.div>
  );
}

function FeaturesSection() {
  const features = [
    { icon: Sword, title: "Daily Quests", desc: "Complete randomized daily challenges to earn points and avoid the penalty zone." },
    { icon: TrendingUp, title: "Stat Tracking", desc: "Visualize your growth. Allocate points to Strength, Agility, Sense, Vitality, and Intelligence." },
    { icon: Shield, title: "Dungeon Keys", desc: "Unlock special workout routines categorized by difficulty ranks E to S." },
    { icon: Zap, title: "Job Change", desc: "Evolve your workout style. Unlock advanced classes like Shadow Monarch or Assassin." },
  ];

  return (
    <section id="features" className="py-32 bg-black/50 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactInput>({
    resolver: zodResolver(api.contact.submit.input)
  });
  
  const { mutateAsync: createContact } = useCreateContact();
  const [alert, setAlert] = useState<{ open: boolean, type: "success" | "error", title: string, message: string }>({
    open: false, type: "success", title: "", message: ""
  });

  const onSubmit = async (data: ContactInput) => {
    try {
      await createContact(data);
      setAlert({
        open: true,
        type: "success",
        title: "Message Transmitted",
        message: "Your inquiry has been sent to the Hunter's Guild."
      });
      reset();
    } catch (error) {
      setAlert({
        open: true,
        type: "error",
        title: "Transmission Failed",
        message: error instanceof Error ? error.message : "Unknown system error occurred."
      });
    }
    
    setTimeout(() => setAlert(prev => ({ ...prev, open: false })), 5000);
  };

  return (
    <section id="contact" className="py-32 relative">
      <SystemAlert 
        isOpen={alert.open} 
        type={alert.type} 
        title={alert.title} 
        message={alert.message} 
      />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 bg-card/30 border border-white/5 p-8 md:p-12 rounded-2xl backdrop-blur-sm">
          
          <div>
            <h2 className="text-4xl text-white mb-2">JOIN THE <span className="text-secondary">GUILD</span></h2>
            <p className="text-gray-400 font-mono mb-8">Send a message to the system administrators.</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-gray-500">Hunter Name</label>
                <input 
                  {...register("name")}
                  className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-primary focus:outline-none focus:shadow-[0_0_15px_rgba(0,242,255,0.2)] transition-all font-mono"
                  placeholder="Sung Jin-Woo"
                />
                {errors.name && <span className="text-destructive text-xs">{errors.name.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-gray-500">Contact Email</label>
                <input 
                  {...register("email")}
                  className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-primary focus:outline-none focus:shadow-[0_0_15px_rgba(0,242,255,0.2)] transition-all font-mono"
                  placeholder="hunter@guild.com"
                />
                {errors.email && <span className="text-destructive text-xs">{errors.email.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-gray-500">Inquiry Message</label>
                <textarea 
                  {...register("message")}
                  rows={4}
                  className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-primary focus:outline-none focus:shadow-[0_0_15px_rgba(0,242,255,0.2)] transition-all font-mono resize-none"
                  placeholder="Requesting dungeon access..."
                />
                {errors.message && <span className="text-destructive text-xs">{errors.message.message}</span>}
              </div>

              <NeonButton type="submit" isLoading={isSubmitting} className="w-full">
                Transmit Message <Send size={16} />
              </NeonButton>
            </form>
          </div>

          <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12">
            <div>
              <h3 className="text-2xl text-white mb-6">ALTERNATE CHANNEL</h3>
              <p className="text-gray-400 mb-6 font-mono text-sm leading-relaxed">
                Prefer a direct application? Access the external Google Form to submit your hunter application directly to the Association database.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-secondary/20 to-transparent p-6 rounded-xl border border-secondary/30 box-glow-purple">
              <h4 className="text-secondary font-bold text-lg mb-2">HUNTER ASSOCIATION FORM</h4>
              <p className="text-xs text-gray-300 mb-6 font-mono">Form ID: #HA-2024-X</p>
              
              <a 
                href="https://forms.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-secondary text-white font-bold uppercase tracking-widest hover:bg-secondary/80 transition-colors rounded shadow-[0_0_15px_rgba(157,0,255,0.4)]"
              >
                Open External Form <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-black">
      <div className="container mx-auto px-4 text-center">
        <div className="text-primary font-display font-bold text-2xl mb-4">SOLOLVL</div>
        <p className="text-gray-600 font-mono text-sm">
          © 2024 Hunter Association. All rights reserved. <br/>
          System Interface v1.0.4
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-white">
      <ParallaxCharacter />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DashboardSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
