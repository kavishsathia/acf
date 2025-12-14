import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col justify-between p-6 md:p-12 border-b border-swiss-black relative overflow-hidden">
      <nav className="flex justify-between items-center mb-20">
        <div className="font-display text-2xl tracking-tighter uppercase font-bold">Unsloppify</div>
        <div className="hidden md:flex gap-8 font-mono text-sm">
          <a href="#problem" className="hover:text-swiss-red transition-colors">The Problem</a>
          <a href="#solution" className="hover:text-swiss-red transition-colors">The Solution</a>
          <a href="#call" className="hover:text-swiss-red transition-colors">Get Access</a>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-6xl md:text-[8rem] leading-[0.85] tracking-tighter uppercase mb-8">
              Your agent <br/>
              <span className="text-swiss-red">shipped</span> <br/>
              broken code.
            </h1>
          </motion.div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 items-start lg:items-end text-left lg:text-right">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-mono text-sm md:text-base max-w-sm space-y-4"
          >
            <p>
              It looked fine. The tests passed. Your verifier said <span className="bg-swiss-black text-swiss-bg px-1">200 OK</span>.
            </p>
            <p className="text-swiss-gray text-swiss-black/70">
              But it hardcoded the colors. Ignored your design system. Copy-pasted validation logic you already had.
            </p>
            <div className="flex items-center gap-2 text-swiss-red pt-4 lg:justify-end">
              <AlertTriangle className="w-5 h-5" />
              <span className="uppercase tracking-widest text-xs font-bold">Silent Failure</span>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="mt-20 flex justify-between items-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className="font-mono text-xs uppercase tracking-widest opacity-50">
          Scroll to investigate
        </div>
        <ArrowDown className="animate-bounce w-6 h-6" />
      </motion.div>
    </section>
  );
};