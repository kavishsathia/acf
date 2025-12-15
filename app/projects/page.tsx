"use client";

import React, { useState, useEffect } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { ProfileMenu } from '@/components/ui/ProfileMenu';
import { Button } from '@/components/ui/Button';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import { Plus, Folder } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail?: string | null;
  violationCount: number;
  contractCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');

      if (response.status === 401) {
        window.location.href = '/signin';
        return;
      }

      const data = (await response.json()) as { projects?: Project[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch projects');
      }

      setProjects(data.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-swiss-bg flex items-center justify-center">
        <div className="font-mono text-sm uppercase tracking-widest">
          Loading projects...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-swiss-bg p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="font-display text-5xl md:text-6xl uppercase tracking-tighter mb-2">
              Projects
            </h1>
            <div className="h-1 w-16 bg-swiss-red"></div>
          </div>
          <ProfileMenu />
        </div>

        {error && (
          <div className="bg-white border-2 border-swiss-red p-4 mb-8">
            <p className="text-swiss-red font-mono text-sm">{error}</p>
          </div>
        )}

        {projects.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20">
            <Folder className="w-24 h-24 text-swiss-black/20 mb-6" />
            <h2 className="font-display text-3xl uppercase tracking-tight mb-2">
              No Projects Yet
            </h2>
            <p className="font-mono text-sm text-swiss-black/60 mb-8">
              Create your first project to get started
            </p>
            <Button size="lg" variant="primary" onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-5 h-5 mr-2 inline" />
              Create Project
            </Button>
          </div>
        )}

        {projects.length > 0 && (
          <>
            <div className="mb-8">
              <Button variant="primary" size="md" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2 inline" />
                Create Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  description={project.description}
                  thumbnail={project.thumbnail}
                  violationCount={project.violationCount}
                  contractCount={project.contractCount}
                  createdAt={new Date(project.createdAt)}
                  updatedAt={new Date(project.updatedAt)}
                />
              ))}
            </div>
          </>
        )}

        <CreateProjectDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onProjectCreated={fetchProjects}
        />
      </div>
    </div>
  );
}
