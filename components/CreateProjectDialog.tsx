"use client";

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from './ui/Button';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: () => void;
}

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  open,
  onOpenChange,
  onProjectCreated,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create project');
      }

      setName('');
      setDescription('');
      onOpenChange(false);
      onProjectCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-swiss-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-swiss-bg border-4 border-swiss-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg p-8 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <Dialog.Title className="font-display text-4xl uppercase tracking-tighter mb-2">
            Create Project
          </Dialog.Title>
          <div className="h-1 w-16 bg-swiss-red mb-6"></div>

          <Dialog.Close className="absolute right-8 top-8 opacity-70 hover:opacity-100 transition-opacity">
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-white border-2 border-swiss-red p-4">
                <p className="text-swiss-red font-mono text-sm">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block font-mono text-xs uppercase tracking-widest mb-2"
              >
                Project Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white border-2 border-swiss-black p-4 font-mono focus:outline-none focus:border-swiss-red transition-colors"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block font-mono text-xs uppercase tracking-widest mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full bg-white border-2 border-swiss-black p-4 font-mono focus:outline-none focus:border-swiss-red transition-colors resize-none"
                disabled={loading}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
