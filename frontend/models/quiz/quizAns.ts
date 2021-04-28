export interface quizAns {
    id?: number;
    name: string;
    order: number;
    choices: {
        id?: number;
        order?: number;
        name: string;
        isCorrect: boolean;
    }[];
}

export default quizAns;
