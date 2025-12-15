import { tool } from 'ai';
import { z } from 'zod';
import { getSandbox, type Sandbox } from '@cloudflare/sandbox';

interface Env {
	Sandbox: DurableObjectNamespace<Sandbox>;
}

export function createWorkspaceTools(env: Env, projectId: string) {
	return {
		writeFile: tool({
			description: 'Write content to a file in the workspace. Creates the file if it does not exist, overwrites if it does.',
			inputSchema: z.object({
				path: z.string().describe('The absolute path to the file (e.g., /workspace/app/src/index.ts)'),
				content: z.string().describe('The content to write to the file'),
			}),
			execute: async ({ path, content }: { path: string; content: string }) => {
				try {
					const sandbox = getSandbox(env.Sandbox, projectId);
					await sandbox.writeFile(path, content, { encoding: 'utf-8' });
					return { success: true, path, message: `File written successfully: ${path}` };
				} catch (error) {
					return {
						success: false,
						path,
						error: error instanceof Error ? error.message : 'Unknown error',
					};
				}
			},
		}),

		readFile: tool({
			description: 'Read the contents of a file in the workspace.',
			inputSchema: z.object({
				path: z.string().describe('The absolute path to the file (e.g., /workspace/app/src/index.ts)'),
			}),
			execute: async ({ path }: { path: string }) => {
				try {
					const sandbox = getSandbox(env.Sandbox, projectId);
					const file = await sandbox.readFile(path, { encoding: 'utf-8' });
					return { success: true, path, content: file.content };
				} catch (error) {
					return {
						success: false,
						path,
						error: error instanceof Error ? error.message : 'Unknown error',
					};
				}
			},
		}),

		runBash: tool({
			description: 'Execute a bash command in the workspace. Use for installing packages or any shell operations.',
			inputSchema: z.object({
				command: z.string().describe('The bash command to execute'),
				cwd: z.string().optional().describe('Working directory for the command (default: /workspace)'),
			}),
			execute: async ({ command, cwd }: { command: string; cwd?: string }) => {
				try {
					const sandbox = getSandbox(env.Sandbox, projectId);
					const result = await sandbox.exec(command, { cwd: cwd ?? '/workspace' });
					return {
						success: result.success,
						exitCode: result.exitCode,
						stdout: result.stdout,
						stderr: result.stderr,
						duration: result.duration,
					};
				} catch (error) {
					return {
						success: false,
						error: error instanceof Error ? error.message : 'Unknown error',
					};
				}
			},
		}),

		replaceText: tool({
			description:
				'Replace a specific text string in a file. Use this for precise edits instead of rewriting entire files. The oldText must match exactly.',
			inputSchema: z.object({
				path: z.string().describe('The absolute path to the file'),
				oldText: z.string().describe('The exact text to find and replace'),
				newText: z.string().describe('The text to replace it with'),
			}),
			execute: async ({ path, oldText, newText }: { path: string; oldText: string; newText: string }) => {
				try {
					const sandbox = getSandbox(env.Sandbox, projectId);
					const file = await sandbox.readFile(path, { encoding: 'utf-8' });
					const content = file.content;

					if (!content.includes(oldText)) {
						return {
							success: false,
							path,
							error: 'oldText not found in file. Make sure it matches exactly including whitespace.',
						};
					}

					const occurrences = content.split(oldText).length - 1;
					if (occurrences > 1) {
						return {
							success: false,
							path,
							error: `oldText found ${occurrences} times. Please provide more context to make it unique.`,
						};
					}

					const newContent = content.replace(oldText, newText);
					await sandbox.writeFile(path, newContent, { encoding: 'utf-8' });

					return { success: true, path, message: 'Text replaced successfully' };
				} catch (error) {
					return {
						success: false,
						path,
						error: error instanceof Error ? error.message : 'Unknown error',
					};
				}
			},
		}),
	};
}
