import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { BearerStrategy } from './strategy/bearer.strategy';
import { CookieStrategy } from './strategy/cookie.strategy';

@Module({
    providers: [AuthService, CookieStrategy, BearerStrategy],
    imports: [UsersModule, PassportModule.register({ session: false })],
    exports: [AuthService],
})
export class AuthModule {}
