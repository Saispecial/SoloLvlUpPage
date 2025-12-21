import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export function ParallaxCharacter() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  
  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform scroll progress to vertical position
  // Starts at 10% from top, ends at 80% down the page
  const y = useTransform(smoothProgress, [0, 1], ["10vh", "85vh"]);
  
  // Slight rotation/float effect based on scroll velocity could be added, 
  // but let's stick to a clean "guide" movement
  const opacity = useTransform(smoothProgress, [0, 0.05, 0.9, 1], [0, 1, 1, 0]);

  return (
    <motion.div 
      ref={ref}
      style={{ y, opacity }}
      className="fixed right-4 md:right-10 top-0 z-50 pointer-events-none hidden lg:block"
    >
      {/* Character Container */}
      <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
        {/* The "System" Window Aesthetic */}
        <div className="absolute inset-0 border border-primary/30 bg-black/60 backdrop-blur-sm rounded-lg box-glow transform rotate-3" />
        
        {/* Inner Content - A stylized avatar */}
        <div className="relative z-10 w-full h-full p-2 flex flex-col items-center justify-center gap-2">
          <div className="w-16 h-16 rounded-full border-2 border-primary overflow-hidden shadow-[0_0_15px_var(--primary)] bg-black">
             {/* Use a generic hooded figure / shadow icon */}
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-primary p-2">
               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
             </svg>
          </div>
          
          <div className="text-center">
            <div className="text-primary text-xs font-mono tracking-widest uppercase">System</div>
            <div className="text-white text-[10px] font-bold uppercase tracking-wider">Scroll to Level Up</div>
          </div>
        </div>

        {/* Decorative lines connecting to scroll bar conceptually */}
        <div className="absolute top-1/2 -right-10 w-10 h-[1px] bg-primary/50" />
      </div>
    </motion.div>
  );
}
