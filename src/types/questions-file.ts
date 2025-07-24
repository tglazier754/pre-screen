

export interface Question {
    id: string;
    question: string;
    weight: number;
    response?: string;
    respondedAt?: string;//date time
    required: boolean;
    group: number;
    analysis?: string;
    score?: "fail" | "weak" | "adequate" | "strong" | "expert";
    followedFrom?: string;//id of the question that generated this follow-up
    wasPreviouslyAsked: boolean; //to keep track of which question was asked
}