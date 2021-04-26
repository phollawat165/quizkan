import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin';
import { Injectable } from '@nestjs/common';
import { UpdateQuery } from 'mongoose';
import { UserDocument } from 'src/users/entities/user.entity';
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
    async validateUser(token: string): Promise<UserDocument | null> {
        try {
            const userModel = this.usersService.getModel();
            const decodedToken = await this.firebaseAuthService.verifyIdToken(
                token,
            );
            let user = await this.usersService.findOne(decodedToken.uid);
            if (user) return user;
            const userRecord = await this.firebaseAuthService.getUser(
                decodedToken.uid,
            );
            const update: UpdateQuery<UserDocument> = {
                displayName: userRecord.displayName || 'Player',
                email: userRecord.email,
                isAnonymous: userRecord.email == null,
            };
            user = await userModel
                .findOneAndUpdate({ uid: userRecord.uid }, update, {
                    upsert: true,
                })
                .exec();
            return user;
        } catch (err) {
            if (err.code)
                console.error('Firebase Error:', err.code, err.message);
            else console.error(err.stack);
            return null;
        }
    }
}
