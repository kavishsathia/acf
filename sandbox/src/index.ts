import { generateText, Experimental_Agent as Agent, stepCountIs } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { getSandbox, proxyToSandbox, Sandbox } from '@cloudflare/sandbox';
import { createWorkspaceTools } from './workspace';

// Export Sandbox class for Durable Object binding
export { Sandbox } from '@cloudflare/sandbox';

interface Env {
	GOOGLE_GENERATIVE_AI_API_KEY: string;
	WORKER_API_SECRET: string;
	NEXT_APP_URL: string;
	Sandbox: DurableObjectNamespace<Sandbox>;
}

interface MessagePayload {
	role: 'assistant' | 'tool_call' | 'tool_result';
	content?: string;
	toolName?: string;
	toolArgs?: Record<string, unknown>;
	toolResult?: unknown;
	usage?: Record<string, unknown>;
}

async function saveMessages(env: Env, threadId: string, messages: MessagePayload[]): Promise<void> {
	if (messages.length === 0) return;
	try {
		await fetch(`${env.NEXT_APP_URL}/api/threads/${threadId}/messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-secret': env.WORKER_API_SECRET,
			},
			body: JSON.stringify({ messages }),
		});
	} catch (error) {
		console.error('Failed to save messages:', error);
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		// Proxy requests to exposed ports first
		const proxyResponse = await proxyToSandbox(request, env);
		if (proxyResponse) return proxyResponse;

		const url = new URL(request.url);
		const { hostname } = url;

		// API secret validation for worker endpoints
		const apiSecret = request.headers.get('x-api-secret');
		if (!apiSecret || apiSecret !== env.WORKER_API_SECRET) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Route to endpoints
		if (url.pathname === '/setup' && request.method === 'POST') {
			return handleSetup(request, env, hostname);
		}

		if (url.pathname === '/test' && request.method === 'POST') {
			return handleTest(request, env, hostname);
		}

		if (url.pathname === '/poem' && request.method === 'GET') {
			return handlePoem(env);
		}

		if (url.pathname === '/edit' && request.method === 'POST') {
			return handleEdit(request, env, hostname);
		}

		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;

async function handleTest(request: Request, env: Env, hostname: string): Promise<Response> {
	try {
		const body = (await request.json()) as { projectId: string };

		if (!body.projectId) {
			return new Response(
				JSON.stringify({
					error: 'Bad Request',
					message: 'projectId is required',
				}),
				{
					status: 400,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		}

		const { projectId } = body;

		// Get or create sandbox using projectId
		const sandbox = getSandbox(env.Sandbox, projectId);

		console.log(`[${projectId}] Creating simple Node.js HTTP server...`);

		// Create a simple Node.js HTTP server using echo
		await sandbox.exec(
			"echo \"const http = require('http'); const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('<h1>Hello from Cloudflare Sandbox!</h1><p>The sandbox is working correctly.</p>'); }); server.listen(3001, '0.0.0.0', () => { console.log('Server running on 0.0.0.0:3001'); });\" > /workspace/server.js"
		);

		console.log(`[${projectId}] Starting Node.js HTTP server on port 3001...`);

		// Start Node.js server
		const processHandle = await sandbox.startProcess('node /workspace/server.js', {
			cwd: '/workspace',
		});

		console.log(`[${projectId}] Process started, waiting for server to be ready...`);
		console.log(`[${projectId}] Process handle:`, JSON.stringify(processHandle));

		// Wait for server to start
		await new Promise((resolve) => setTimeout(resolve, 3000));

		// Check if process is still running
		const processes = await sandbox.listProcesses();
		console.log(`[${projectId}] Running processes:`, JSON.stringify(processes));

		// Test if server is responding from inside container
		const curlTest = await sandbox.exec('curl -v http://localhost:3001/ 2>&1');
		console.log(`[${projectId}] Curl localhost test:`, curlTest.stdout, curlTest.stderr);

		const curlTest2 = await sandbox.exec('curl -v http://0.0.0.0:3001/ 2>&1');
		console.log(`[${projectId}] Curl 0.0.0.0 test:`, curlTest2.stdout, curlTest2.stderr);

		// Expose port 3001
		console.log(`[${projectId}] Exposing port 3001...`);
		const exposed = await sandbox.exposePort(3001, { hostname });

		console.log(`[${projectId}] Test server ready! Preview URL: ${exposed.url}`);

		return new Response(
			JSON.stringify({
				projectId,
				previewUrl: exposed.url,
				message: 'Test server running successfully',
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	} catch (error) {
		console.error('Test setup error:', error);
		return new Response(
			JSON.stringify({
				error: 'Internal Server Error',
				message: error instanceof Error ? error.message : 'Unknown error',
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
}

async function handleSetup(request: Request, env: Env, hostname: string): Promise<Response> {
	try {
		const body = (await request.json()) as { projectId: string };
		if (!body.projectId) {
			return new Response(JSON.stringify({ error: 'Bad Request' }), { status: 400 });
		}

		const { projectId } = body;
		const sandbox = getSandbox(env.Sandbox, projectId);

		console.log(`[${projectId}] Starting Express server on port 3001...`);

		await sandbox.startProcess('node /workspace/app/dist/server.js', {
			cwd: '/workspace/app',
		});

		// Wait for server to start
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Verify server is running
		const check = await sandbox.exec('curl -s http://0.0.0.0:3001/health');
		console.log(`[${projectId}] Health check:`, check.stdout);

		// Expose port
		const exposed = await sandbox.exposePort(3001, { hostname });
		console.log(`[${projectId}] Preview URL: ${exposed.url}`);

		return new Response(
			JSON.stringify({
				projectId,
				previewUrl: exposed.url,
				message: 'Express server running successfully',
			}),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error) {
		console.error('Setup error:', error);
		return new Response(
			JSON.stringify({
				error: 'Internal Server Error',
				message: error instanceof Error ? error.message : 'Unknown error',
			}),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}

async function handlePoem(env: Env): Promise<Response> {
	try {
		// Create Google AI provider with API key
		const google = createGoogleGenerativeAI({
			apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
		});

		// Generate a poem using Gemini 2.5 Flash
		const { text } = await generateText({
			model: google('gemini-2.5-flash'),
			prompt: 'Write a short, beautiful poem about code and creativity.',
		});

		return new Response(
			JSON.stringify({
				poem: text,
				model: 'gemini-2.5-flash',
				timestamp: new Date().toISOString(),
			}),
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			}
		);
	} catch (error) {
		console.error('Failed to generate poem:', error);
		return new Response(
			JSON.stringify({
				error: 'Failed to generate poem',
				message: error instanceof Error ? error.message : 'Unknown error',
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
}

async function handleEdit(request: Request, env: Env, hostname: string): Promise<Response> {
	try {
		const body = (await request.json()) as { projectId: string; threadId: string; prompt: string };

		if (!body.projectId || !body.threadId || !body.prompt) {
			return new Response(
				JSON.stringify({
					error: 'Bad Request',
					message: 'projectId, threadId, and prompt are required',
				}),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		const { projectId, threadId, prompt } = body;
		const sandbox = getSandbox(env.Sandbox, projectId);

		console.log(`[${projectId}] Loading documentation...`);

		// Load Alpine documentation from the sandbox
		const [alpineAjaxDoc, alpineJsDoc] = await Promise.all([
			sandbox.readFile('/workspace/app/ALPINE-AJAX.md', { encoding: 'utf-8' }).catch(() => ({ content: '' })),
			sandbox.readFile('/workspace/app/ALPINE-JS.md', { encoding: 'utf-8' }).catch(() => ({ content: '' })),
		]);

		// Create workspace tools
		const tools = createWorkspaceTools(env, projectId, hostname);

		// Build system prompt with documentation
		const systemPrompt = `You are an expert web developer assistant working in a sandbox environment. Your job is to help users build and modify web applications using Alpine.js and Alpine AJAX.

You have access to the following tools:
- writeFile: Write content to a file
- readFile: Read file contents
- runBash: Execute bash commands (for npm, builds, etc.)
- replaceText: Make precise text replacements in files
- show: Expose a port and get the preview URL

The workspace is at /workspace. The main application files are in /workspace/app:
- /workspace/app/public/index.html - The HTML template
- /workspace/app/public/styles.css - The CSS styles
- /workspace/app/src/server.ts - The Express server (TypeScript)

## Alpine.js Reference
${alpineJsDoc.content}

## Alpine AJAX Reference
${alpineAjaxDoc.content}

## Guidelines
- Use Alpine.js directives (x-data, x-show, x-on, etc.) for interactivity
- Use Alpine AJAX (x-target, method, action) for AJAX requests
- Server responses must include matching IDs for x-target to work
- Follow Swiss design principles: clean typography, minimal colors (#F4F4F0 bg, #0A0A0A text, #FF3300 accent)
- After making changes, use runBash to rebuild if needed (npm run build in /workspace/app)
- Use show tool to expose port 3001 when the user wants to see the result

Be helpful, precise, and complete tasks fully.`;

		console.log(`[${projectId}] Calling AI agent with prompt: ${prompt.substring(0, 100)}...`);

		// Create Google AI provider
		const google = createGoogleGenerativeAI({
			apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
		});

		// Create and run the agent
		const agent = new Agent({
			model: google('gemini-2.5-flash'),
			system: systemPrompt,
			tools,
			stopWhen: stepCountIs(20),
			onStepFinish: async ({ text, toolCalls, toolResults, usage }) => {
				console.log(`[${projectId}] Step finished. Tool calls: ${toolCalls?.length ?? 0}`);

				const messages: MessagePayload[] = [];

				// Add tool calls
				if (toolCalls) {
					for (const toolCall of toolCalls) {
						messages.push({
							role: 'tool_call',
							toolName: toolCall.toolName,
							toolArgs: toolCall.input as Record<string, unknown>,
						});
					}
				}

				// Add tool results
				if (toolResults) {
					for (const toolResult of toolResults) {
						messages.push({
							role: 'tool_result',
							toolName: toolResult.toolName,
							toolResult: toolResult.output,
						});
					}
				}

				// Add assistant text response
				if (text) {
					messages.push({
						role: 'assistant',
						content: text,
						usage: usage as Record<string, unknown>,
					});
				}

				await saveMessages(env, threadId, messages);
			},
		});

		const result = await agent.generate({ prompt });

		console.log(`[${projectId}] Agent completed. Steps: ${result.steps?.length ?? 0}`);

		return new Response(
			JSON.stringify({
				projectId,
				response: result.text,
				steps: result.steps?.length ?? 0,
				toolCalls: result.steps?.flatMap((s) => s.toolCalls ?? []).length ?? 0,
			}),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error) {
		console.error('Edit error:', error);
		return new Response(
			JSON.stringify({
				error: 'Internal Server Error',
				message: error instanceof Error ? error.message : 'Unknown error',
			}),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
