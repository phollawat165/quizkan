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
    answers: Record<
        number,
        { score: number; time: number; choice: number; isCorrect: boolean }
    >;
    /** Scores */
    totalScore: number;
    /** Joined at timestamps in milliseconds */
    joinedAt: number;
    /** Is host */
    isHost: boolean;
}
