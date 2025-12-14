import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

interface Env {
	GOOGLE_GENERATIVE_AI_API_KEY: string;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
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
	},
} satisfies ExportedHandler<Env>;
