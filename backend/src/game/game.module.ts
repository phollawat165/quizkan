import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Quiz, QuizSchema } from './entities/quiz.entity';
import { GameGateway } from './game.gateway';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';

@Module({
    providers: [GameGateway, QuizzesService],
    controllers: [QuizzesController],
    imports: [
        AuthModule,
        MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
    ],
})
export class GameModule {}
