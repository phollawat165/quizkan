import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        private firebase: FirebaseAuthenticationService,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const user = await this.userModel.create(createUserDto);
        return user;
    }

    async findAll() {
        return this.userModel.find().exec();
    }

    async findOne(uid: string) {
        return this.userModel.findOne({ uid: uid }).exec();
    }

    async update(uid: string, updateUserDto: UpdateUserDto) {
        return this.userModel
            .findOneAndUpdate({ uid: uid }, updateUserDto)
            .exec();
    }

    async remove(uid: string) {
        return this.userModel.deleteOne({ uid: uid }).exec();
    }
}
