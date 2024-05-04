import {AssistantResponse} from "../../../interfaces/assistant.response.ts";

export const PostQuestionUseCase = async (threadId: string, question: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_ASSISTANT_API}/user-question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                threadId,
                question
            })
        })
        console.log(resp);
        return await resp.json() as AssistantResponse[];
    } catch (e) {
        console.error(e);
        throw new Error('Failed to create a post question');
    }
}