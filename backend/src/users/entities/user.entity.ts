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
}

export const UserSchema = SchemaFactory.createForClass(User);
