import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { defaultSchemaOptions } from 'src/util/constants';

export type GameDocument = Game & Document;

@Schema({ ...defaultSchemaOptions, timestamps: true })
export class Game {
    @Prop({ required: true, unique: true })
    code: string;

    @Prop()
    createAt: Date;

    @Prop()
    updatedAt: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
