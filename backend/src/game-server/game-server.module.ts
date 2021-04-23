import { DynamicModule, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GameServerGateway } from './gateway/game-server.gateway';
import { GameServerService } from './game-server.service';
import AgonesSDK from '@google-cloud/agones-sdk';
import { PlayersService } from './player/players.service';
import { GameModule } from 'src/game/game.module';

@Module({})
export class GameServerModule {
    static register(): DynamicModule {
        const mode = process.env.MODE;
        const load =
            mode === 'game-server' || mode === 'server' || mode === 'game';
        const moduleOptions = load
            ? {
                  providers: [
                      GameServerGateway,
                      GameServerService,
                      {
                          provide: AgonesSDK,
                          useValue: new AgonesSDK(),
                      },
                      PlayersService,
                  ],
                  exports: [GameServerService],
                  imports: [AuthModule, GameModule],
              }
            : {};
        return {
            module: GameServerModule,
            ...moduleOptions,
        };
    }
}
