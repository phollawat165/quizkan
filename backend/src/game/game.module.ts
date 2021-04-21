import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Quiz, QuizSchema } from './entities/quiz.entity';
import { QuizzesService } from './quizzes.service';

@Module({
    providers: [QuizzesService],
    imports: [
        AuthModule,
        MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
    ],
    exports: [QuizzesService],
})
export class GameModule {}
