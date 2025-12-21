import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface SystemAlertProps {
  type: "success" | "error";
  title: string;
  message: string;
  isOpen: boolean;
  onClose?: () => void;
}

export function SystemAlert({ type, title, message, isOpen }: SystemAlertProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
        >
          <div className={`
            relative overflow-hidden border-2 bg-black/90 backdrop-blur-xl p-6 shadow-2xl
            ${type === 'success' ? 'border-primary shadow-[0_0_30px_rgba(0,242,255,0.2)]' : 'border-destructive shadow-[0_0_30px_rgba(239,68,68,0.2)]'}
          `}>
            <div className="flex items-start gap-4">
              <div className={type === 'success' ? 'text-primary' : 'text-destructive'}>
                {type === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
              </div>
              <div>
                <h3 className={`text-xl font-bold uppercase tracking-widest mb-1 ${type === 'success' ? 'text-primary' : 'text-destructive'}`}>
                  {title}
                </h3>
                <p className="text-gray-300 font-mono text-sm leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
            
            {/* Animated scanline */}
            <motion.div 
              initial={{ top: "-100%" }}
              animate={{ top: "200%" }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className={`absolute left-0 right-0 h-1/2 opacity-10 bg-gradient-to-b ${type === 'success' ? 'from-primary' : 'from-destructive'} to-transparent pointer-events-none`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
