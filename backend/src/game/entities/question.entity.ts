import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { defaultSchemaOptions } from 'src/util/constants';

export type QuestionDocument = Question & Document;

@Schema({ ...defaultSchemaOptions })
export class Question {
    @Prop(raw({ type: String, required: true }))
    name: string;

    @Prop({ required: true })
    order: number;

    @Prop(
        raw([
            {
                order: { type: Number, required: true },
                name: { type: String, required: true },
                isCorrect: { type: Boolean, default: false },
            },
        ]),
    )
    choices: { name: string; isCorrect: boolean }[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
