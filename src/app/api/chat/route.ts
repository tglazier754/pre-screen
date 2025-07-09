
import { openai } from "@ai-sdk/openai"
import { appendResponseMessages, streamText } from "ai"
import { saveChat } from '@/tools/chat-store';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
    const { messages, id } = await req.json()

    const result = streamText({
        model: openai("gpt-4o"),
        messages,
        system: "You are a helpful assistant. Be concise and friendly in your responses.",
        async onFinish({ response }) {
            await saveChat({
                id,
                messages: appendResponseMessages({
                    messages,
                    responseMessages: response.messages,
                }),
            });
        },
    })

    return result.toDataStreamResponse()
}
