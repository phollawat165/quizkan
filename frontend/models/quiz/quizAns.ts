export interface quizAns {
    id?: number;
    question: string;
    order: number;
    newOrder?: boolean;
    choices: {
        id: number;
        newOrder?: number;
        name: string;
        isCorrect: boolean;
    }[];
}

export default quizAns;
