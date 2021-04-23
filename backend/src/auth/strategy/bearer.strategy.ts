import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(token: string): Promise<UserDocument> {
        const user = await this.authService.validateUser(token);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
