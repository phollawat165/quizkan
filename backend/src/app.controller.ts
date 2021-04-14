import {
    BadRequestException,
    Controller,
    DefaultValuePipe,
    Get,
    NotFoundException,
    Param,
    Post,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import dayjs from 'dayjs';
import { TokenAuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Post('/files')
    @UseInterceptors(FileInterceptor('file'))
    async postFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
        if (!file) throw new BadRequestException();
        const path = `./uploads/${dayjs().format('YYYYMMDDHHmmssZZ')}_${
            file.originalname
        }`;
        await fs.copyFile(file.path, path);
        await fs.unlink(file.path);
        return { url: path };
    }

    @Get('/uploads/:name')
    @UseGuards(TokenAuthGuard)
    async getFile(
        @Param('name', new DefaultValuePipe(null)) name: string,
        @Res() res: Response,
    ) {
        const path = `./uploads/${name}`;
        if (name === null || !fs.access(path)) throw new NotFoundException();
        fsSync.createReadStream(path).pipe(res);
    }
}
