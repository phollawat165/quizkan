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
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UpdateUserDto } from '../../users/dto/update-user.dto';
import { TokenAuthGuard } from 'src/auth/auth.guard';
import { UserDocument } from '../../users/entities/user.entity';

@Controller('users')
@UseGuards(TokenAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    
    @Post('/sync')
    async syncDevicesToken(@Body() body: any, @Request() req: Express.Request){
        const token = body.token;
        const name = body.name;
        const user = req.user as UserDocument;
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findOne(id);
        if (!user) throw new NotFoundException();
        return user;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        const user = await this.usersService.update(id, updateUserDto);
        if (!user) throw new NotFoundException();
        return user;
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const user = await this.usersService.findOne(id);
        if (!user) throw new NotFoundException();
        await this.usersService.remove(id);
        return;
    }
}
