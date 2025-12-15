"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, RefreshCw, Send, User, Bot, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Project {
  id: string;
  name: string;
  description: string;
}

interface Message {
  id: string;
  role: string;
  content: string | null;
  toolName: string | null;
  toolArgs: Record<string, unknown> | null;
  toolResult: unknown;
  createdAt: string;
}

interface Thread {
  id: string;
  name: string;
  messages: Message[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupLoading, setSetupLoading] = useState(false);
  const [error, setError] = useState('');

  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (project) {
      fetchThreads();
    }
  }, [project]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);

      if (response.status === 401) {
        window.location.href = '/signin';
        return;
      }

      const data = (await response.json()) as { project?: Project; error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch project');
      }

      setProject(data.project || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  const fetchThreads = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/threads`);
      const data = (await response.json()) as { threads?: Thread[]; error?: string };

      if (response.ok && data.threads && data.threads.length > 0) {
        const latestThread = data.threads[0];
        setThreadId(latestThread.id);
        setMessages(latestThread.messages);
      }
    } catch (err) {
      console.error('Failed to fetch threads:', err);
    }
  };

  const checkStatus = async (): Promise<boolean> => {
    try {
      const response = await fetch(`/api/projects/${projectId}/status`);
      const data = (await response.json()) as { active?: boolean; previewUrl?: string };

      if (data.active && data.previewUrl) {
        setPreviewUrl(data.previewUrl);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const setupSandbox = async () => {
    setSetupLoading(true);
    setError('');

    try {
      // First check if sandbox is already active
      const isActive = await checkStatus();
      if (isActive) {
        setSetupLoading(false);
        return;
      }

      // Not active, run setup
      const response = await fetch(`/api/projects/${projectId}/setup`, {
        method: 'POST',
      });

      const data = (await response.json()) as { previewUrl?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup sandbox');
      }

      setPreviewUrl(data.previewUrl || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup sandbox');
    } finally {
      setSetupLoading(false);
    }
  };

  useEffect(() => {
    if (project && !previewUrl && !setupLoading) {
      setupSandbox();
    }
  }, [project]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const messageContent = input.trim();
    setInput('');
    setSending(true);

    try {
      let currentThreadId = threadId;

      if (!currentThreadId) {
        const createResponse = await fetch(`/api/projects/${projectId}/threads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: messageContent.substring(0, 50) }),
        });

        if (createResponse.status === 401) {
          window.location.href = '/signin';
          return;
        }

        const createData = (await createResponse.json()) as { thread?: { id: string }; error?: string };

        if (!createResponse.ok) {
          console.error('Thread creation failed:', createData);
          throw new Error(createData.error || 'Failed to create thread');
        }

        currentThreadId = createData.thread!.id;
        setThreadId(currentThreadId);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          role: 'user',
          content: messageContent,
          toolName: null,
          toolArgs: null,
          toolResult: null,
          createdAt: new Date().toISOString(),
        },
      ]);

      const sendResponse = await fetch(`/api/threads/${currentThreadId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageContent }),
      });

      const sendData = (await sendResponse.json()) as {
        userMessage?: Message;
        editResponse?: { response?: string };
        editError?: string;
        error?: string;
      };

      if (!sendResponse.ok) {
        throw new Error(sendData.error || 'Failed to send message');
      }

      await fetchThreads();
      setIframeKey((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages((prev) => prev.filter((m) => !m.id.startsWith('temp-')));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessage = (message: Message) => {
    if (message.role === 'user') {
      return (
        <div key={message.id} className="flex gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-swiss-black flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-mono text-sm">{message.content}</p>
          </div>
        </div>
      );
    }

    if (message.role === 'assistant') {
      return (
        <div key={message.id} className="flex gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-swiss-red flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-mono text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      );
    }

    if (message.role === 'tool_call') {
      return (
        <div key={message.id} className="flex gap-3 mb-2 ml-11">
          <div className="flex-1 bg-swiss-bg border border-swiss-black/20 p-2 rounded">
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="w-3 h-3 text-swiss-black/60" />
              <span className="font-mono text-xs text-swiss-black/60 uppercase">
                {message.toolName}
              </span>
            </div>
            {message.toolArgs && (
              <pre className="font-mono text-xs text-swiss-black/80 overflow-x-auto">
                {JSON.stringify(message.toolArgs, null, 2).substring(0, 200)}
                {JSON.stringify(message.toolArgs, null, 2).length > 200 && '...'}
              </pre>
            )}
          </div>
        </div>
      );
    }

    if (message.role === 'tool_result') {
      return (
        <div key={message.id} className="flex gap-3 mb-4 ml-11">
          <div className="flex-1 bg-green-50 border border-green-200 p-2 rounded">
            <span className="font-mono text-xs text-green-600">
              {message.toolName} completed
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-swiss-bg flex items-center justify-center">
        <div className="font-mono text-sm uppercase tracking-widest">
          Loading project...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-swiss-bg flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-sm text-swiss-red mb-4">
            {error || 'Project not found'}
          </p>
          <Link href="/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-swiss-bg flex flex-col">
      {/* Header */}
      <div className="border-b-2 border-swiss-black px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl uppercase tracking-tight">
              {project.name}
            </h1>
            <p className="font-mono text-xs text-swiss-black/60">
              {project.description}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={setupSandbox}
          disabled={setupLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 inline ${setupLoading ? 'animate-spin' : ''}`} />
          Restart
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - Message thread (35%) */}
        <div className="w-[35%] border-r-2 border-swiss-black flex flex-col">
          <div className="p-4 border-b border-swiss-black/20">
            <h2 className="font-mono text-xs uppercase tracking-widest text-swiss-black/60">
              Messages
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="font-mono text-sm text-swiss-black/40 text-center py-8">
                Start a conversation to edit your project
              </p>
            ) : (
              <>
                {messages.map(renderMessage)}
                {sending && (
                  <div className="flex gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-swiss-red flex items-center justify-center flex-shrink-0">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                    <div className="flex-1">
                      <p className="font-mono text-sm text-swiss-black/60">
                        Thinking...
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          <div className="p-4 border-t border-swiss-black/20">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-white border-2 border-swiss-black p-3 font-mono text-sm focus:outline-none focus:border-swiss-red transition-colors"
                disabled={sending}
              />
              <Button
                variant="primary"
                size="md"
                onClick={sendMessage}
                disabled={sending || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right panel - Website preview (65%) */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-4 border-b border-swiss-black/20 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-widest text-swiss-black/60">
              Preview
            </h2>
            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-swiss-blue hover:underline"
              >
                {previewUrl}
              </a>
            )}
          </div>
          <div className="flex-1 relative">
            {setupLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-swiss-bg">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-swiss-black/40" />
                  <p className="font-mono text-sm text-swiss-black/60">
                    Starting sandbox...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-swiss-bg">
                <div className="text-center">
                  <p className="font-mono text-sm text-swiss-red mb-4">{error}</p>
                  <Button variant="outline" size="sm" onClick={setupSandbox}>
                    Try Again
                  </Button>
                </div>
              </div>
            ) : previewUrl ? (
              <iframe
                key={iframeKey}
                src={previewUrl}
                className="w-full h-full border-0"
                title="Project Preview"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-swiss-bg">
                <p className="font-mono text-sm text-swiss-black/40">
                  No preview available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
