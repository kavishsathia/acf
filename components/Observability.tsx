import React from 'react';
import { SectionHeader } from './ui/SectionHeader';
import { Activity, ShieldAlert, BarChart3, Lock } from 'lucide-react';

const MetricCard = ({ label, value, sub, icon: Icon }: { label: string, value: string, sub: string, icon: any }) => (
  <div className="bg-white p-6 border border-swiss-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-200">
    <div className="flex justify-between items-start mb-4">
      <div className="text-swiss-black/50 text-xs font-mono uppercase tracking-widest">{label}</div>
      <Icon className="w-5 h-5 text-swiss-red" />
    </div>
    <div className="font-display text-5xl mb-2">{value}</div>
    <div className="text-xs font-mono text-swiss-black/60 border-t border-swiss-black/10 pt-2 mt-2">
      {sub}
    </div>
  </div>
);

export const Observability: React.FC = () => {
  return (
    <section id="observability" className="p-6 md:p-12 border-b border-swiss-black bg-swiss-bg">
       <div className="flex flex-col md:flex-row justify-between items-end mb-16">
         <SectionHeader number="04" title="Total Visibility" className="mb-0 border-none" />
         <p className="max-w-md text-right font-mono text-sm text-swiss-black/60 hidden md:block">
           Stream telemetry. Define detection rules.<br/>
           Alert when agents go off-rails.
         </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <MetricCard 
           label="Compliance Rate" 
           value="99.8%" 
           sub="+12.4% vs last week" 
           icon={Activity}
         />
         <MetricCard 
           label="Violations Caught" 
           value="432" 
           sub="Prevented production incidents" 
           icon={ShieldAlert}
         />
         <MetricCard 
           label="Drift Detection" 
           value="Low" 
           sub="Guidance tightening active" 
           icon={BarChart3}
         />
         <MetricCard 
           label="Contract Strength" 
           value="A+" 
           sub="Strict verification mode" 
           icon={Lock}
         />
       </div>

       <div className="mt-12 p-8 border border-swiss-black bg-white">
          <div className="font-mono text-xs uppercase tracking-widest mb-6">Real-time Auditing</div>
          <div className="flex items-end gap-1 h-32 md:h-48 w-full items-end">
            {[40, 65, 30, 80, 55, 90, 45, 70, 85, 60, 75, 50, 95, 30, 60, 40].map((h, i) => (
              <div 
                key={i} 
                className="bg-swiss-black hover:bg-swiss-red transition-colors flex-1"
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
       </div>
    </section>
  );
};