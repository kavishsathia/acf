import React from 'react';
import { SectionHeader } from './ui/SectionHeader';
import { X, Search, EyeOff, Terminal } from 'lucide-react';

export const Problem: React.FC = () => {
  return (
    <section id="problem" className="min-h-screen p-6 md:p-12 border-b border-swiss-black bg-white">
      <SectionHeader number="01" title="The Rotting Codebase" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
        <div className="space-y-12">
          <div className="prose prose-lg">
            <h3 className="font-display text-3xl uppercase mb-6">Agents fail silently.</h3>
            <p className="font-sans text-lg leading-relaxed text-swiss-black/80">
              Traditional observability was built for deterministic systems. Return codes. Error logs. Stack traces.
              <br/><br/>
              <strong className="font-medium text-swiss-black">Agents don't fail like that.</strong>
              <br/><br/>
              They misunderstand intent. They take shortcuts. They generate code that works but violates every pattern you've established.
            </p>
          </div>

          <div className="border border-swiss-black p-8 relative">
            <div className="absolute top-0 left-0 bg-swiss-black text-white text-xs px-2 py-1 font-mono uppercase">
              Current Reality
            </div>
            <ul className="space-y-6 mt-4">
              {[
                "Hope for the best",
                "Review every line manually",
                "Write complex prompts that get ignored",
                "Discover violations in production"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 group">
                  <div className="w-8 h-8 flex items-center justify-center border border-swiss-red text-swiss-red rounded-full group-hover:bg-swiss-red group-hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-swiss-bg border border-swiss-black p-4 font-mono text-sm relative overflow-hidden h-full min-h-[400px]">
           <div className="flex items-center gap-2 border-b border-swiss-black/10 pb-4 mb-4">
              <Terminal className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest text-swiss-black/50">Production Logs</span>
           </div>
           
           <div className="space-y-2 opacity-70">
              <div className="text-green-700">GET /api/user/generate 200 OK</div>
              <div className="text-green-700">GET /api/user/validate 200 OK</div>
              <div className="text-green-700">POST /api/deploy 200 OK</div>
              <div className="pl-4 text-swiss-black/40 border-l-2 border-swiss-red my-4 py-2">
                 <span className="text-swiss-red font-bold">HIDDEN ERROR:</span> 
                 <br/>Component 'UserCard' uses inline styles.
                 <br/>Hardcoded hex #333333.
                 <br/>Skipped 'zod' validation.
              </div>
              <div className="text-green-700">GET /api/status 200 OK</div>
           </div>

           <div className="absolute bottom-6 right-6">
              <div className="bg-swiss-red text-white text-6xl font-display uppercase tracking-tighter rotate-[-10deg] shadow-lg p-4 border-2 border-white">
                 It's Slop
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};