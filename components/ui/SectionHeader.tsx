import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  number: string;
  title: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ number, title, className }) => {
  return (
    <div className={`flex flex-col md:flex-row items-start md:items-baseline gap-4 mb-12 border-b border-swiss-black pb-4 ${className}`}>
      <motion.span 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="font-mono text-swiss-red text-sm md:text-base"
      >
        {number}
      </motion.span>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="font-display text-4xl md:text-6xl uppercase tracking-tighter text-swiss-black"
      >
        {title}
      </motion.h2>
    </div>
  );
};