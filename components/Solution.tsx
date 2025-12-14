import React from 'react';
import { SectionHeader } from './ui/SectionHeader';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, RefreshCw } from 'lucide-react';

const Step = ({ title, desc, icon: Icon, number }: { title: string, desc: string, icon: any, number: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white p-8 border border-swiss-black group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="bg-swiss-black text-white p-3 transition-colors duration-300">
        <Icon className="w-6 h-6" />
      </div>
      <span className="font-display text-5xl text-swiss-black/10 group-hover:text-swiss-red transition-colors duration-300">
        {number}
      </span>
    </div>
    <h3 className="font-display text-3xl uppercase mb-4">{title}</h3>
    <p className="font-sans text-swiss-black/70 leading-relaxed">
      {desc}
    </p>
  </motion.div>
);

export const Solution: React.FC = () => {
  return (
    <section id="solution" className="min-h-screen p-6 md:p-12 bg-swiss-bg border-b border-swiss-black flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <SectionHeader number="02" title="The Agentic Contract" />

        <div className="mb-16 max-w-2xl">
           <p className="text-xl md:text-2xl font-sans font-light leading-tight">
             Your agent doesn't just execute. It commits.
             <span className="block mt-4 text-swiss-red font-medium">Three layers. One truth.</span>
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Step
            number="01"
            icon={FileText}
            title="Contract"
            desc="Before writing a single line, the agent generates a contract: 'I will use Button from the design system. I will follow existing validation patterns.'"
          />
          <Step
            number="02"
            icon={ShieldCheck}
            title="Verify"
            desc="A separate verifier checks the actual code against the contract. Did it actually use the design system? Or did it fake it? No guessing."
          />
          <Step
            number="03"
            icon={RefreshCw}
            title="Tighten"
            desc="When violations are caught, contract guidance gets stricter. The agent is forced to specify more detail next time. The system learns."
          />
        </div>
      </div>
    </section>
  );
};