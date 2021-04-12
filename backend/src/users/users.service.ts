import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin';
import {
    Injectable,
    MethodNotAllowedException,
    NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private firebase: FirebaseAuthenticationService) {}
    async create(createUserDto: CreateUserDto) {
        throw new MethodNotAllowedException();
    }

    async findAll() {
        return (await this.firebase.listUsers()).users;
    }

    async findOne(id: string) {
        try {
            return await this.firebase.getUser(id);
        } catch (err) {
            this.handleAuthException(err);
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        try {
            return await this.firebase.updateUser(id, updateUserDto);
        } catch (err) {
            this.handleAuthException(err);
        }
    }

    async remove(id: string) {
        try {
            return await this.firebase.deleteUser(id);
        } catch (err) {
            this.handleAuthException(err);
        }
    }

    private handleAuthException(err) {
        if (err.code == 'auth/user-not-found')
            throw new NotFoundException(err.message);
        else throw err;
    }
}
