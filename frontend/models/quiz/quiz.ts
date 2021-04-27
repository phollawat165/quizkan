import { quizAns } from './quizAns';

export interface quiz {
    id?: number;
    title: string;
    owner: string;
    isPublished: boolean;
    color: number;
    order: number;
    createdAt: string;
    updatedAt: string;
    questions: quizAns[];
}

export default quiz;
