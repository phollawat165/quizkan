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

@Injectable()
export class GameServerService implements OnModuleInit, OnModuleDestroy {
    constructor(
        private moduleRef: ModuleRef,
        private authService: AuthService,
        private scheudlerRegistry: SchedulerRegistry,
    ) {}

    private logger: Logger = new Logger(GameServerService.name);
    private server: Server;
    // Mapping between user id and socket
    private sockets: Map<string, Socket> = new Map();
    // Mapping between socket id and user id
    private socketIds: Map<string, string> = new Map();
    // Mapping between user id and user document
    private users: Map<string, UserDocument> = new Map();

    onModuleInit() {
        this.server = this.moduleRef.get(GameServerGateway).getServer();
        this.logger.log('Loaded server instance');
    }

    onModuleDestroy() {
        this.logger.log('Shutting down game server');
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
            this.sockets.set(user.uid, client);
            this.users.set(user.uid, user);
            this.socketIds.set(client.id, user.uid);
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
}
