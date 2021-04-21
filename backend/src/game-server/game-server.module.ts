import { DynamicModule, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GameServerGateway } from './gateway/game-server.gateway';
import { GameServerService } from './game-server.service';

@Module({})
export class GameServerModule {
    static register(): DynamicModule {
        const mode = process.env.MODE;
        const load =
            mode === 'game-server' || mode === 'server' || mode === 'game';
        const moduleOptions = load
            ? {
                  providers: [GameServerGateway, GameServerService],
                  exports: [GameServerService],
                  imports: [AuthModule],
              }
            : {};
        return {
            module: GameServerModule,
            ...moduleOptions,
        };
    }
}
