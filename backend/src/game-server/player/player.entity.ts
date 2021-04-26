import { Socket } from 'socket.io';
import { UserDocument } from 'src/users/entities/user.entity';

export interface Player {
    /** Firebase Auth user id */
    uid: string;
    /** User document */
    user: UserDocument;
    /** Client socket instance */
    socket: Socket;
    /** Answer to the question */
    answers: Record<number, { choice: number; isCorrect: boolean }>;
    /** Score record */
    scores: Record<number, { score: number; time: number }>;
}
