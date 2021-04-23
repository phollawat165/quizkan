import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/entities/user.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/uptate-quiz.dto';
import { Quiz, QuizDocument } from './entities/quiz.entity';
import fs from 'fs/promises';

@Injectable()
export class QuizzesService {
    constructor(
        @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    ) {}

    async create(createQuizDto: CreateQuizDto, user: UserDocument) {
        const quiz = new this.quizModel(createQuizDto);
        quiz.owner = user;
        return quiz.save();
    }

    async findAll() {
        return this.quizModel.find().exec();
    }

    async findOne(id: string) {
        return this.quizModel.findById(id).exec();
    }

    async findByOwner(user: UserDocument) {
        return this.quizModel.find({ owner: user._id }).exec();
    }

    async update(id: string, updateQuizDto: UpdateQuizDto) {
        return this.quizModel.findByIdAndUpdate(id, updateQuizDto).exec();
    }

    async remove(id: string) {
        return this.quizModel.deleteOne({ _id: id }).exec();
    }

    getModel(): Model<QuizDocument> {
        return this.quizModel;
    }

    async createManyFromFile(path: string) {
        const json = JSON.parse(await fs.readFile(path, { encoding: 'utf-8' }));
        return this.quizModel.insertMany(json);
    }
}
