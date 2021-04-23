import { Socket } from 'socket.io';
import { UserDocument } from 'src/users/entities/user.entity';

export interface Player {
    /** Firebase Auth user id */
    uid: string;
    /** User document */
    user: UserDocument;
    /** Client socket instance */
    socket: Socket;
}
