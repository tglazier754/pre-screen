import { Question } from "@/types/questions-file";

//return the first question in the array that has the wasPreviouslyAsked flag set
export const getPreviouslyAskedQuestion = (questions: Question[]): Question | undefined => {

    const res = questions.find((question) => {
        return question.wasPreviouslyAsked;
    })

    return res;
}

export const getNextQuestionToAsk = (questions: Question[]): Question | undefined => {
    const res = questions.find((question) => {
        return question.response === undefined;
    })
    return res;
}

export const replaceQuestion = (questions: Question[], updatedQuestion: Question) => {

    const res: Question[] = [];

    questions.forEach((question) => {
        if (question.id === updatedQuestion.id) {
            res.push(updatedQuestion);
        }
        else {
            res.push(question);
        }
    });
    return res;
}