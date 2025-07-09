import { ChatOpenAI } from "@langchain/openai";
import {
    START,
    END,
    MessagesAnnotation,
    StateGraph,
    MemorySaver,
} from "@langchain/langgraph";


//any for now
export const getChatResponse: any = async (state: typeof MessagesAnnotation.State) => {
    const llm = new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0
    });
    const response = await llm.invoke(state.messages);
    return { messages: response };
}

const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", getChatResponse)
    .addEdge(START, "model")
    .addEdge("model", END);

const memory = new MemorySaver();
export const app = workflow.compile({ checkpointer: memory });
