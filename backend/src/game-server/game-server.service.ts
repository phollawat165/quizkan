import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import dayjs from 'dayjs';
import { AuthService } from 'src/auth/auth.service';
import { GameServerGateway } from './gateway/game-server.gateway';
import { ModuleRef } from '@nestjs/core';
import { UserDocument } from 'src/users/entities/user.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import AgonesSDK from '@google-cloud/agones-sdk';
import { PlayersService } from './player/players.service';
import { FirebaseMessagingService } from '@aginix/nestjs-firebase-admin';

@Injectable()
export class GameServerService implements OnModuleInit, OnModuleDestroy {
    constructor(
        private moduleRef: ModuleRef,
        private authService: AuthService,
        private schedulerRegistry: SchedulerRegistry,
        private agones: AgonesSDK,
        private playerService: PlayersService,
        private messagingService: FirebaseMessagingService,
    ) {}

    private logger: Logger = new Logger(GameServerService.name);
    private server: Server;
    // Mapping between user id and socket
    private sockets: Map<string, Socket> = new Map();
    // Mapping between socket id and user id
    private socketIds: Map<string, string> = new Map();
    // Mapping between user id and user document
    private users: Map<string, UserDocument> = new Map();

    async onModuleInit() {
        // Get Server instance
        this.server = this.moduleRef.get(GameServerGateway).getServer();
        this.logger.log('Loaded server instance');
        // Agones
        await this.agones.connect();
        this.schedulerRegistry.addInterval(
            'agones:health',
            setInterval(() => {
                this.agones.health();
            }, 3000),
        );
        this.agones.watchGameServer((gameServer) => {
            this.logger.log('Game server status changed!');
            this.logger.log(gameServer);
        });
        this.logger.log('Connected to Agones');
    }

    async onModuleDestroy() {
        this.logger.log('Shutting down game server');
        // Agones
        this.schedulerRegistry.deleteInterval('agones:health');
    }

    async handleLogin(client: Socket) {
        const user = await this.authService.validateUser(
            (client.handshake.auth as any).token,
        );
        // If invalid credentials
        if (!user) {
            client.emit('disconnectLogin', { reason: 'Incorrect credentials' });
            client.disconnect();
        } else {
            // Store users details on the server
            this.playerService.addPlayerRaw(client, user);
            // Send welcome message
            this.schedulerRegistry.addTimeout(
                `game-server:hello:${user.uid}`,
                setTimeout(() => {
                    this.messagingService.sendToDevice(
                        user.devices.map((device) => device.token),
                        {
                            notification: {
                                title: 'QuizKan',
                                body: 'Welcome to The Game ',
                            },
                        },
                    );
                }, 5000),
            );
            // Send login success
            client.emit('loginSuccess', {
                user: user.toJSON(),
                time: dayjs().toISOString(),
            });
            this.logger.log(`User ${user.uid} logged in`);
        }
    }

    async handleDisconnect(client: Socket) {
        // Remove users details on the server
        const uid = this.socketIds.get(client.id);
        this.socketIds.delete(client.id);
        this.users.delete(uid);
        this.sockets.delete(uid);
    }

    getLogger() {
        return this.logger;
    }

    getServer() {
        return this.server;
    }
}
