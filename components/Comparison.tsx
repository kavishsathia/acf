import React, { useState } from 'react';
import { SectionHeader } from './ui/SectionHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

export const Comparison: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'without' | 'with'>('without');

  return (
    <section className="min-h-screen p-6 md:p-12 bg-swiss-black text-swiss-bg border-b border-swiss-bg/20">
      <SectionHeader number="03" title="The Reality Check" className="text-swiss-bg border-swiss-bg/20" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
        <div className="lg:col-span-4 space-y-8">
           <h3 className="font-display text-4xl uppercase leading-none">
             Stop shipping <br/>
             <span className="text-swiss-red">working slop</span>.
           </h3>
           <p className="font-mono text-sm text-swiss-bg/60">
             Compare the output. One is verifiable engineering. The other is a ticking time bomb.
           </p>

           <div className="flex flex-col gap-4">
             <button 
               onClick={() => setActiveTab('without')}
               className={`text-left p-6 border transition-all duration-300 ${activeTab === 'without' ? 'bg-swiss-red border-swiss-red text-white' : 'border-swiss-bg/20 hover:border-swiss-bg/50'}`}
             >
               <div className="font-display text-xl uppercase mb-2">Without Unsloppify</div>
               <div className="font-mono text-xs opacity-80">Silent Drift. Hardcoded values. Technical debt generated at speed.</div>
             </button>
             <button 
               onClick={() => setActiveTab('with')}
               className={`text-left p-6 border transition-all duration-300 ${activeTab === 'with' ? 'bg-swiss-blue border-swiss-blue text-white' : 'border-swiss-bg/20 hover:border-swiss-bg/50'}`}
             >
               <div className="font-display text-xl uppercase mb-2">With Unsloppify</div>
               <div className="font-mono text-xs opacity-80">Semantic Compliance. Design tokens used. Patterns enforced.</div>
             </button>
           </div>
        </div>

        <div className="lg:col-span-8 bg-[#0F0F0F] border border-swiss-bg/10 p-6 md:p-8 font-mono text-sm overflow-hidden relative min-h-[500px]">
          <div className="absolute top-0 left-0 w-full h-8 bg-swiss-bg/5 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
          </div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'without' ? (
              <motion.div 
                key="without"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mt-8 space-y-4"
              >
                 <div className="text-gray-500">// UserCard.tsx</div>
                 <div>
                   <span className="text-purple-400">export</span> <span className="text-blue-400">const</span> UserCard = ({'{'} name {'}'}) ={'>'} {'{'}
                 </div>
                 <div className="pl-4 text-gray-500">// Hardcoded styles, ignoring Tailwind config</div>
                 <div className="pl-4">
                    <span className="text-blue-400">return</span> (
                 </div>
                 <div className="pl-8">
                    &lt;<span className="text-red-400">div</span> <span className="text-yellow-300">style</span>={'{'}{'{'} 
                    <span className="text-green-300"> padding</span>: <span className="text-orange-300">'20px'</span>, 
                    <span className="text-green-300"> borderRadius</span>: <span className="text-orange-300">'8px'</span>, 
                    <span className="text-green-300"> background</span>: <span className="text-orange-300">'#f0f0f0'</span> 
                    {'}'}{'}'}&gt;
                 </div>
                 <div className="pl-12">
                   &lt;<span className="text-red-400">h3</span>&gt;{'{'}name{'}'}&lt;/<span className="text-red-400">h3</span>&gt;
                 </div>
                 <div className="pl-12 text-gray-500">// Validation logic duplicated inline</div>
                 <div className="pl-12">
                   {'{'}name.length &gt; 0 && ... {'}'}
                 </div>
                 <div className="pl-8">
                   &lt;/<span className="text-red-400">div</span>&gt;
                 </div>
                 <div className="pl-4">);</div>
                 <div>{'}'};</div>
                 
                 <div className="mt-8 p-4 border border-red-500/30 bg-red-900/10 text-red-400 flex items-center gap-4">
                    <X />
                    <span>VERIFICATION FAILED: Violates Design System Guidelines</span>
                 </div>
              </motion.div>
            ) : (
               <motion.div 
                key="with"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mt-8 space-y-4"
              >
                 <div className="text-gray-500">// UserCard.tsx</div>
                 <div>
                   <span className="text-purple-400">import</span> {'{'} Card, Text {'}'} <span className="text-purple-400">from</span> <span className="text-orange-300">'@design-system/core'</span>;
                 </div>
                 <div>
                   <span className="text-purple-400">export</span> <span className="text-blue-400">const</span> UserCard = ({'{'} name {'}'}) ={'>'} {'{'}
                 </div>
                 <div className="pl-4 text-gray-500">// Uses standardized components</div>
                 <div className="pl-4">
                    <span className="text-blue-400">return</span> (
                 </div>
                 <div className="pl-8">
                    &lt;<span className="text-yellow-300">Card</span> <span className="text-green-300">variant</span>=<span className="text-orange-300">"elevated"</span> <span className="text-green-300">padding</span>=<span className="text-orange-300">"lg"</span>&gt;
                 </div>
                 <div className="pl-12">
                   &lt;<span className="text-yellow-300">Text</span> <span className="text-green-300">typography</span>=<span className="text-orange-300">"heading-3"</span>&gt;
                 </div>
                 <div className="pl-16">{'{'}name{'}'}</div>
                 <div className="pl-12">
                   &lt;/<span className="text-yellow-300">Text</span>&gt;
                 </div>
                 <div className="pl-8">
                   &lt;/<span className="text-yellow-300">Card</span>&gt;
                 </div>
                 <div className="pl-4">);</div>
                 <div>{'}'};</div>

                 <div className="mt-8 p-4 border border-green-500/30 bg-green-900/10 text-green-400 flex items-center gap-4">
                    <Check />
                    <span>CONTRACT VERIFIED: Compliance 100%</span>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};