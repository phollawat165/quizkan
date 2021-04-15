import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin';
import { Injectable } from '@nestjs/common';
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
    async validateUser(token: string): Promise<any | null> {
        try {
            const userRecord = await this.firebaseAuthService.verifyIdToken(
                token,
            );
            let user = await this.usersService.findOne(userRecord.uid);
            if (!user) {
                user = await this.usersService.create({ uid: userRecord.uid });
            }
            return user;
        } catch (err) {
            return null;
        }
    }
}
