import { quizAns } from './quizAns';

export interface quiz {
    id: number;
    title: string;
    owner: string;
    isPublished: boolean;
    color: number;
    count: number;
    createdAt: string;
    updatedAt: string;
    question: quizAns[];
}

export default quiz;
