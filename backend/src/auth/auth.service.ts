import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin';
import { Injectable } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private firebaseAuthService: FirebaseAuthenticationService,
    ) {}

    /**
     * Validate id token
     * @param token Firebase id token from the client SDK
     * @returns User if the token is valid, null otherwise
     */
    async validateUser(token: string): Promise<auth.UserRecord | null> {
        try {
            const userRecord = await this.firebaseAuthService.verifyIdToken(
                token,
            );
            const user = this.usersService.findOne(userRecord.uid);
            return user;
        } catch (err) {
            return null;
        }
    }
}
