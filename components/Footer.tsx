import React from 'react';
import { Button } from './ui/Button';
import { Github, FileText, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="call" className="bg-swiss-black text-swiss-bg p-6 md:p-12 relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 py-20 border-b border-swiss-bg/20">
        <div>
          <h2 className="font-display text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-8">
            Stop Hoping.<br/>
            Start <span className="text-outline-white text-transparent" style={{ WebkitTextStroke: '2px #F4F4F0' }}>Verifying</span>.
          </h2>
          <p className="font-sans text-xl max-w-md opacity-80 mb-12">
            The Agentic Contract Framework is free, MIT licensed, and ready for production. 
            Integrate in minutes.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" variant="secondary" className="flex items-center gap-2 group">
              Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-swiss-bg border-swiss-bg hover:bg-swiss-bg hover:text-swiss-black">
              <Github className="w-4 h-4 mr-2 inline" /> GitHub
            </Button>
            <Button size="lg" variant="outline" className="text-swiss-bg border-swiss-bg hover:bg-swiss-bg hover:text-swiss-black">
              <FileText className="w-4 h-4 mr-2 inline" /> Documentation
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col justify-end items-start lg:items-end font-mono text-sm space-y-4 opacity-60">
           <p>Framework-agnostic</p>
           <p>Model-agnostic</p>
           <p>Task-agnostic</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-8 opacity-40 font-mono text-xs">
        <div>
          &copy; {new Date().getFullYear()} Unsloppify. MIT Licensed.
        </div>
        <div className="mt-4 md:mt-0">
          Built by someone tired of agents shipping garbage.
        </div>
      </div>
    </footer>
  );
};