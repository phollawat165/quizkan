import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    app.enableCors();
    app.enableShutdownHooks();
    await app.listen(
        configService.get<string>('PORT', '8000'),
        configService.get<string>('HOST', '0.0.0.0'),
    );
}
bootstrap();
