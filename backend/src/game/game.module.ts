import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Game, GameSchema } from './entities/game.entity';
import { Quiz, QuizSchema } from './entities/quiz.entity';
import { GamesService } from './games.service';
import { QuizzesService } from './quizzes.service';

@Module({
    providers: [QuizzesService, GamesService],
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            { name: Quiz.name, schema: QuizSchema },
            { name: Game.name, schema: GameSchema },
        ]),
    ],
    exports: [QuizzesService, GamesService],
})
export class GameModule {}
