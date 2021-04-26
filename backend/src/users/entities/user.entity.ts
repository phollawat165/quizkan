import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/auth/role/role.enum';
import { defaultSchemaOptions } from 'src/util/constants';
import { Device, DeviceSchema } from './device.entity';

export type UserDocument = User & Document;

@Schema({ ...defaultSchemaOptions, timestamps: true })
export class User {
    @Prop({ required: true, unique: true, index: true })
    uid: string;

    @Prop({ default: [Role.User] })
    roles: Role[];

    @Prop([DeviceSchema])
    devices: Device[];

    @Prop({ default: 'Player', index: true })
    displayName: string;

    @Prop({ default: null, index: true, sparse: true })
    email: string;

    @Prop({ type: Object, default: null })
    firebaseUser: any;

    @Prop({ default: false })
    isAnonymous: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
