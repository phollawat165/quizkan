import AgonesSDK from '@google-cloud/agones-sdk';
import { Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameServerService } from '../game-server.service';

@WebSocketGateway({
    cors: { origin: '*', methods: ['GET', 'POST'], credentials: true },
})
export class GameServerGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private logger: Logger = new Logger(GameServerGateway.name);
    @WebSocketServer()
    private server: Server;

    constructor(
        private gameServerService: GameServerService,
        private agones: AgonesSDK,
        private moduleRef: ModuleRef,
    ) {}

    afterInit(server: Server) {
        this.logger.log('Server running in GAME-SERVER mode');
        this.logger.log('WebSocket Gateway initialized');
        if (process.env.AGONES_ENABLED === 'true') {
            this.agones.connect().then(() => {
                this.agones.ready().then(() => {
                    this.logger.log('Server is now ready for the game.');
                });
            });
        }
    }

    async handleConnection(client: Socket, ...args: any[]) {
        this.logger.log('Client connected');
        await this.gameServerService.handleLogin(client);
    }

    async handleDisconnect(client: Socket) {
        this.logger.log('Client disconnected');
        await this.gameServerService.handleDisconnect(client);
    }

    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: any): string {
        return 'Hello world!';
    }

    getServer(): Server {
        return this.server;
    }
}
