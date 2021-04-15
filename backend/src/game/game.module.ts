import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GameGateway } from './game.gateway';

@Module({
    providers: [GameGateway],
    imports: [AuthModule],
})
export class GameModule {}
