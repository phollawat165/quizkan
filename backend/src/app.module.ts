/* eslint-disable @typescript-eslint/no-var-requires */
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import * as admin from 'firebase-admin';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { StorageModule } from './storage/storage.module';
import { GameModule } from './game/game.module';
import mongoose from 'mongoose';

@Module({
    imports: [
        // Config
        ConfigModule.forRoot(),
        // Firebase Admin SDK
        FirebaseAdminModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                // Load custom credentials from env file
                credential: admin.credential.cert({
                    privateKey: config
                        .get<string>('FIREBASE_ADMIN_PRIVATE_KEY')
                        .replace(/\\n/g, '\n'),
                    clientEmail: config.get<string>(
                        'FIREBASE_ADMIN_CLIENT_EMAIL',
                    ),
                    projectId: config.get<string>('FIREBASE_ADMIN_PROJECT_ID'),
                }),
                projectId: config.get<string>('FIREBASE_ADMIN_PROJECT_ID'),
                databaseURL: `https://${config.get<string>(
                    'FIREBASE_ADMIN_PROJECT_ID',
                )}.firebaseio.com`,
            }),
        }),
        // File Upload
        MulterModule.register({
            dest: './uploads',
            limits: { fieldNameSize: 255, fieldSize: 20 * 2 ** 20 },
        }),
        // MongoDB
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                mongoose.plugin(require('mongoose-lean-virtuals'));
                mongoose.plugin(require('mongoose-hidden')());
                mongoose.set('returnOriginal', false);
                //mongoose.set('debug', true);
                return {
                    uri: config.get<string>(
                        'MONGODB_URI',
                        'mongodb://localhost:27017/quizkan',
                    ),
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                    useFindAndModify: false,
                    poolSize: 10,
                    autoIndex: true,
                };
            },
        }),
        // Schedule,
        ScheduleModule.forRoot(),
        UsersModule,
        AuthModule,
        StorageModule,
        GameModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements OnModuleInit {
    onModuleInit() {
        // dayjs plugin
        dayjs.extend(advancedFormat);
        dayjs.extend(duration);
        dayjs.extend(relativeTime);
        dayjs.extend(isBetween);
    }
}
