import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/entities/user.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game, GameDocument } from './entities/game.entity';
import { GameState } from './game-state.enum';

@Injectable()
export class GamesService {
    constructor(
        @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    ) {}

    async create(createGameDto: CreateGameDto, user: UserDocument) {
        const game = new this.gameModel(createGameDto);
        game.host = user;
        return game.save();
    }

    async findAll() {
        return this.gameModel.find().exec();
    }

    async findOne(id: string) {
        return this.gameModel.findById(id).exec();
    }

    async findByCode(code: string, gameState = GameState.CREATED) {
        return this.gameModel.findOne({ code: code, state: gameState }).exec();
    }

    async findByHost(user: UserDocument) {
        return this.gameModel.find({ host: user.id }).exec();
    }

    async update(id: string, updateGameDto: UpdateGameDto) {
        return this.gameModel.findByIdAndUpdate(id, updateGameDto as any);
    }

    async remove(id: string) {
        return this.gameModel.findByIdAndDelete(id);
    }

    getModel(): Model<GameDocument> {
        return this.gameModel;
    }
}
