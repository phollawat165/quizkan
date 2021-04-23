import { Logger, UseFilters } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { SchedulerRegistry } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { AllExceptionsFilter } from '../game/exception.filter';

@WebSocketGateway({
    cors: { origin: '*', methods: ['GET', 'POST'], credentials: true },
})
@UseFilters(AllExceptionsFilter)
export class LobbyGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private logger: Logger = new Logger(LobbyGateway.name);
    @WebSocketServer()
    private server: Server;

    constructor(
        private authService: AuthService,
        private schedulerRegistry: SchedulerRegistry,
    ) {}

    afterInit(server: any) {
        this.logger.log('Server running in LOBBY mode');
        this.logger.log('WebSocket Gateway initialized');
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log('Client connected');
        // @see https://socket.io/docs/v3/emit-cheatsheet/
        this.server.emit('message', { message: 'Please login' });
    }

    handleDisconnect(client: Socket) {
        this.logger.log('Client disconnected');
    }

    @SubscribeMessage('message')
    handleEcho(client: Socket, payload: any): string {
        return payload;
    }

    @SubscribeMessage('login')
    async handleLogin(client: Socket, payload: any): Promise<any> {
        if (!payload.uid || !payload.token) {
            throw new WsException('Credentials is required');
        }
        this.logger.log(`Login attempt from user id: ${payload.uid}`);
        const user = await this.authService.validateUser(payload.token);
        if (user && user.uid === payload.uid) {
            this.logger.log(`User ${user.uid} login successfully`);
            const timeout = setTimeout(() => {
                this.logger.log('After 3 seconds');
                client.emit('message', {
                    message: 'Welcome to the server!',
                });
            }, 3000);
            this.schedulerRegistry.addTimeout(`login:${user.uid}`, timeout);
            return {
                status: 'ok',
                message: 'Login success',
                time: dayjs().toISOString(),
            };
        } else {
            this.logger.warn(
                `Login failed for user id: ${payload.uid} reason: Invalid token`,
            );
            throw new WsException('Invalid token');
        }
    }
}
