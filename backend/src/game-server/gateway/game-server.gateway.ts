import AgonesSDK from '@google-cloud/agones-sdk';
import { Logger, UseFilters } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AllExceptionsFilter } from 'src/game/exception.filter';
import { GameServerService } from '../game-server.service';

@WebSocketGateway({
    cors: { origin: '*', methods: ['GET', 'POST'] },
})
@UseFilters(AllExceptionsFilter)
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
        return payload;
    }

    @SubscribeMessage('host')
    handleHost(client: Socket, payload: any) {
        return this.gameServerService.handleHost(client);
    }

    @SubscribeMessage('start')
    async handleStart(client: Socket, payload: any) {
        const player = this.gameServerService
            .getPlayerService()
            .getPlayerBySocket(client);
        return this.gameServerService.startGame(player);
    }

    @SubscribeMessage('answer')
    async handleAnswer(client: Socket, payload: any) {
        // Set answer
        const player = this.gameServerService
            .getPlayerService()
            .getPlayerBySocket(client);
        // Denied if you are the host
        if (player.isHost) {
            return {
                status: 'error',
                message: "Host can't participate in a game.",
            };
        }
        // If answering is not possible
        if (!this.gameServerService.canAnswer()) {
            return {
                status: 'error',
                message: "You can't answer at this time.",
            };
        }
        return this.gameServerService.handleAnswer(player, payload);
    }

    @SubscribeMessage('skip')
    async handleSkip(client: Socket, payload: any) {
        const player = this.gameServerService
            .getPlayerService()
            .getPlayerBySocket(client);
        return this.gameServerService.handleSkip(player);
    }

    @SubscribeMessage('next')
    async handleNextQuestion(client: Socket, payload: any) {
        const player = this.gameServerService
            .getPlayerService()
            .getPlayerBySocket(client);
        return this.gameServerService.handleNextQuestion(player);
    }

    @SubscribeMessage('end')
    async handleEnd(client: Socket, payload: any) {
        const player = this.gameServerService
            .getPlayerService()
            .getPlayerBySocket(client);
        return this.gameServerService.handleEnd(player);
    }

    getServer(): Server {
        return this.server;
    }
}
