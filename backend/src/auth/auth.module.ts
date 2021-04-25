import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { TokenAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { BearerStrategy } from './strategy/bearer.strategy';
import { CookieStrategy } from './strategy/cookie.strategy';

@Module({
    providers: [
        AuthService,
        CookieStrategy,
        BearerStrategy,
        { provide: APP_GUARD, useClass: TokenAuthGuard },
    ],
    imports: [UsersModule, PassportModule.register({ session: false })],
    exports: [AuthService],
})
export class AuthModule {}
