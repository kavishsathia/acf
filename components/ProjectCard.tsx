import React from 'react';
import { AlertTriangle, FileText } from 'lucide-react';
import Image from 'next/image';

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  thumbnail?: string | null;
  violationCount: number;
  contractCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  description,
  thumbnail,
  violationCount,
  contractCount,
}) => {
  return (
    <div className="bg-white border-2 border-swiss-black p-6 group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer">
      {thumbnail && (
        <div className="w-full h-48 bg-swiss-bg border-2 border-swiss-black mb-4 relative overflow-hidden">
          <Image
            src={thumbnail}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      )}

      {!thumbnail && (
        <div className="w-full h-48 bg-swiss-bg border-2 border-swiss-black mb-4 flex items-center justify-center">
          <FileText className="w-16 h-16 text-swiss-black/20" />
        </div>
      )}

      <h3 className="font-display text-2xl uppercase tracking-tight mb-2">
        {name}
      </h3>

      <p className="font-mono text-sm text-swiss-black/70 mb-4 line-clamp-2">
        {description}
      </p>

      <div className="flex items-center gap-6 pt-4 border-t border-swiss-black/10">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-swiss-red" />
          <span className="font-mono text-xs uppercase tracking-wider">
            {violationCount} <span className="text-swiss-black/60">Violations</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-swiss-blue" />
          <span className="font-mono text-xs uppercase tracking-wider">
            {contractCount} <span className="text-swiss-black/60">Contracts</span>
          </span>
        </div>
      </div>
    </div>
  );
};
