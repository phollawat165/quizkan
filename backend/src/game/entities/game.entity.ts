import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { defaultSchemaOptions } from 'src/util/constants';
import { GameState } from '../game-state.enum';
import { Quiz } from './quiz.entity';
import { customAlphabet } from 'nanoid';

export const CODE_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const generateCode = customAlphabet(CODE_ALPHABET, 6);

export type GameDocument = Game & Document;

@Schema({ ...defaultSchemaOptions, timestamps: true })
export class Game {
    @Prop({
        required: true,
        index: true,
        default: () => generateCode(),
    })
    code: string;

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: User.name,
        index: true,
        sparse: true,
        default: null,
    })
    host: User;

    @Prop([
        {
            type: SchemaTypes.ObjectId,
            ref: User.name,
            index: true,
        },
    ])
    players: User[];

    @Prop({ type: SchemaTypes.ObjectId, ref: Quiz.name, index: true })
    quiz: Quiz;

    @Prop({ default: GameState.CREATED, index: true })
    state: string;

    @Prop()
    url: string;

    @Prop()
    port: number;

    @Prop()
    createAt: Date;

    @Prop()
    updatedAt: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
