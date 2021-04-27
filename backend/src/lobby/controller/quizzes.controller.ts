import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    NotFoundException,
    Request,
    ForbiddenException,
    Query,
} from '@nestjs/common';
import { TokenAuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/role/roles.decorator';
import { UserDocument } from 'src/users/entities/user.entity';
import { CreateQuizDto } from '../../game/dto/create-quiz.dto';
import { UpdateQuizDto } from '../../game/dto/uptate-quiz.dto';
import { QuizzesService } from '../../game/quizzes.service';

@Controller('/quizzes')
@UseGuards(TokenAuthGuard)
export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService) {}

    @Post()
    async create(
        @Body() createQuizDto: CreateQuizDto,
        @Request() request: Express.Request,
    ) {
        const user = request.user as UserDocument;
        return this.quizzesService.create(createQuizDto, user);
    }

    @Get()
    async findAll(@Request() request: Express.Request) {
        return this.quizzesService.findByOwner(request.user as UserDocument);
    }

    @Get('/all')
    @Roles(Role.Admin)
    async findAllAdmin() {
        return this.quizzesService.findAll();
    }

    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @Request() request: Express.Request,
    ) {
        const quiz = await this.quizzesService.findOne(id);
        if (!quiz) throw new NotFoundException();
        // Check permission
        if (quiz.owner != (request.user as UserDocument).id)
            throw new ForbiddenException();
        return quiz;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateQuizDto: UpdateQuizDto,
        @Request() request: Express.Request,
    ) {
        const quiz = await this.quizzesService.findOne(id);
        // Not found
        if (!quiz) throw new NotFoundException();
        // Check permission
        if (quiz.owner != (request.user as UserDocument).id)
            throw new ForbiddenException();
        (updateQuizDto as any).owner = quiz.owner;
        quiz.set(updateQuizDto);
        return quiz.save();
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Request() request: Express.Request) {
        const result = await this.quizzesService.remove(id);
        if (result.deletedCount == 0) throw new NotFoundException();
    }
}
