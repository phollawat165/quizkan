import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import * as admin from 'firebase-admin';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

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
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
