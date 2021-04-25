import { DynamicModule, Module, Provider } from '@nestjs/common';
import { KubeConfig } from '@kubernetes/client-node';
import { LobbyGateway } from './lobby.gateway';
import { QuizzesController } from './controller/quizzes.controller';
import { UsersController } from './controller/users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { GameModule } from 'src/game/game.module';
import { lchmod } from 'node:fs';
import { GamesController } from './controller/games.controller';
import { AllocatorService } from './allocator.service';

@Module({})
export class LobbyModule {
    static register(): DynamicModule {
        const load =
            process.env.MODE === 'default' || process.env.MODE === 'lobby';
        const moduleOptions = load
            ? {
                  providers: [
                      LobbyGateway,
                      {
                          provide: KubeConfig,
                          useFactory: () => {
                              const kc = new KubeConfig();
                              if (process.env.KUBERNETES_SERVICE_HOST)
                                  kc.loadFromCluster();
                              return kc;
                          },
                      },
                      AllocatorService,
                  ],
                  controllers: [
                      QuizzesController,
                      UsersController,
                      GamesController,
                  ],
                  imports: [AuthModule, UsersModule, GameModule],
              }
            : {};
        return {
            module: LobbyModule,
            ...moduleOptions,
        };
    }
}
