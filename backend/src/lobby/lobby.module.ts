import { DynamicModule, Module, Provider } from '@nestjs/common';
import { LobbyGateway } from './lobby.gateway';
import { QuizzesController } from './controller/quizzes.controller';
import { UsersController } from './controller/users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { GameModule } from 'src/game/game.module';

@Module({})
export class LobbyModule {
    static register(): DynamicModule {
        const load =
            process.env.MODE === 'default' || process.env.MODE === 'lobby';
        const moduleOptions = load
            ? {
                  providers: [LobbyGateway],
                  controllers: [QuizzesController, UsersController],
                  imports: [AuthModule, UsersModule, GameModule],
              }
            : {};
        return {
            module: LobbyModule,
            ...moduleOptions,
        };
    }
}
