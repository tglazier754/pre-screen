
import { openai } from "@ai-sdk/openai"
import { appendResponseMessages, generateObject, streamText, } from "ai"
import { saveChat } from '@/tools/chat-store';
import { loadQuestions, saveQuestions } from "@/tools/question-store";
import { getNextQuestionToAsk, getPreviouslyAskedQuestion, replaceQuestion } from "@/tools/questions";
import z from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
    const { messages, id } = await req.json()

    //get the questions record - TODO - replace with DB
    const initialQuestions = await loadQuestions(id);
    let questions = initialQuestions.concat([]);//use concat to get a copy of the array
    console.log(initialQuestions);

    //determine which question was previously asked
    const prevQuestion = getPreviouslyAskedQuestion(questions);

    if (prevQuestion === undefined) {
        //the user's message was not in response to a question
    }
    else {
        prevQuestion.response = messages[messages.length - 1].content;
        //determine if the user's response was adequate
        const { object } = await generateObject({
            model: openai("gpt-4o"),
            schema: z.object({
                score: z.union([
                    z.literal("fail"),
                    z.literal("weak"),
                    z.literal("adequate"),
                    z.literal("strong"),
                    z.literal("expert")
                ]),
                analysis: z.string(),
                requiresFollowup: z.boolean()
            }),
            prompt: `Analyze the following question and answer to determine if the answer is correct. question: ${prevQuestion.question} answer: ${messages[messages.length - 1].content}`
        });
        console.log(object);
        prevQuestion.analysis = object.analysis;
        prevQuestion.score = object.score;
        prevQuestion.wasPreviouslyAsked = false;
        questions = replaceQuestion(initialQuestions, prevQuestion);
        console.log(questions);
        saveQuestions({ id, questions });
    }

    //TODO : have the bot generate a question if the previous answer was insufficient
    //for now we will just select the next question from the list
    //get the model to review previous responses and generate a temperature check that the model can use in the next response

    const nextQuestion = getNextQuestionToAsk(questions);
    console.log("------");
    console.log(nextQuestion);
    const temperature = "You have been scoring particularly well so far";
    let prompt = `Let the candidate know that the interview is now over.`;
    if (nextQuestion !== undefined) {
        nextQuestion.wasPreviouslyAsked = true;
        questions = replaceQuestion(questions, nextQuestion);
        saveQuestions({ id, questions });

        prompt = `Using an analysis of previous performance, pose the following question to the user without providing any additional context. analysis:${temperature}, question:${nextQuestion.question}`;
    }
    else {


    }


    const result = streamText({
        model: openai("gpt-4o"),
        system: "You are a senior level developer, interviewing a candidate for a developer role. Be concise and friendly in your responses, while making sure to not provide additional context.",
        prompt,
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
