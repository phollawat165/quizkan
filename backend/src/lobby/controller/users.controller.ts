import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UpdateUserDto } from '../../users/dto/update-user.dto';
import { TokenAuthGuard } from 'src/auth/auth.guard';
import { UserDocument } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/role/roles.decorator';

@Controller('users')
@UseGuards(TokenAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @Roles(Role.Admin)
    async findAll() {
        return this.usersService.findAll();
    }

    @Post('/sync')
    async sync(@Body() body: any, @Request() req: Express.Request) {
        const token = body.token;
        const name = body.name;
        const user = req.user as UserDocument;
        await user.populate('devices').execPopulate();
        const tokens = [];
        for (const device of user.devices) {
            tokens.push(device.token);
        }
        if (!tokens.includes(token)) {
            user.devices.push({ name: name, token: token });
        }
        await user.save();
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req: Express.Request) {
        const user = await this.usersService.findOne(id);
        if (!user) throw new NotFoundException();
        if ((req.user as UserDocument).uid != user.uid)
            throw new ForbiddenException();
        return user;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Request() req: Express.Request,
    ) {
        let user = await this.usersService.findOne(id);
        if (!user) throw new NotFoundException();
        if ((req.user as UserDocument).uid != user.uid)
            throw new ForbiddenException();
        user = await this.usersService.update(id, updateUserDto);
        return user;
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req: Express.Request) {
        const user = await this.usersService.findOne(id);
        if (!user) throw new NotFoundException();
        if ((req.user as UserDocument).uid != user.uid)
            throw new ForbiddenException();
        await this.usersService.remove(id);
        return;
    }
}
