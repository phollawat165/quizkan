import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { defaultSchemaOptions } from 'src/util/constants';
import { User } from 'src/users/entities/user.entity';
import { Question, QuestionSchema } from './question.entity';

export type QuizDocument = Quiz & Document;

@Schema({
    ...defaultSchemaOptions,
    timestamps: true,
    collation: { locale: 'th' },
})
export class Quiz {
    @Prop({ default: 0 })
    order: number;

    @Prop({ required: true, index: true })
    title: string;

    @Prop({ index: true, sparse: true })
    description: string;

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: User.name,
        index: true,
        sparse: true,
    })
    owner: User;

    @Prop({ default: true })
    isPublished: boolean;

    @Prop()
    color: string;

    @Prop([QuestionSchema])
    questions: Question[];

    @Prop()
    createAt: Date;

    @Prop()
    updatedAt: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
QuizSchema.index({
    name: 'text',
    description: 'text',
    'questions.name': 'text',
    'questions.choices.name': 'text',
});
