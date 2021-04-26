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
import { SchedulerRegistry } from '@nestjs/schedule';
import AgonesSDK from '@google-cloud/agones-sdk';
import { PlayersService } from './player/players.service';
import { FirebaseMessagingService } from '@aginix/nestjs-firebase-admin';
import { GamesService } from 'src/game/games.service';
import { GameDocument } from 'src/game/entities/game.entity';
import { GameState } from 'src/game/game-state.enum';

@Injectable()
export class GameServerService implements OnModuleInit, OnModuleDestroy {
    constructor(
        private moduleRef: ModuleRef,
        private authService: AuthService,
        private schedulerRegistry: SchedulerRegistry,
        private agones: AgonesSDK,
        private playerService: PlayersService,
        private messagingService: FirebaseMessagingService,
        private gamesService: GamesService,
    ) {}

    private logger: Logger = new Logger(GameServerService.name);
    private server: Server;
    // Current game;
    private game: GameDocument = null;
    // If shutdown by user
    private finishedCalled = false;

    async onModuleInit() {
        // Get Server instance
        this.server = this.moduleRef.get(GameServerGateway).getServer();
        this.logger.log('Loaded server instance');
        // Agones
        await this.agones.connect();
        // Health ping
        this.schedulerRegistry.addInterval(
            'agones:health',
            setInterval(() => {
                this.agones.health();
            }, 3000),
        );
        // Listen for game server chaange
        this.agones.watchGameServer((gameServer) => {
            // Retrieve game session info
            if (gameServer.status.state === 'Allocated') {
                if (
                    this.game === null ||
                    this.game.state == GameState.CREATED
                ) {
                    const annotationMap = new Map<string, string>(
                        gameServer.objectMeta.annotationsMap as any,
                    );
                    const gameId = annotationMap.get('gameId');
                    this.logger.log('Retrieving game session info');
                    this.gamesService.findOne(gameId).then((gameDoc) => {
                        // Set game document
                        this.game = gameDoc;
                        this.logger.log('Done retrieving game session info');
                    });
                }
            }
        });
        this.logger.log('Connected to Agones');
    }

    async onModuleDestroy() {
        this.logger.log('Shutting down game server');
        await this.finish();
        // Agones
        this.schedulerRegistry.deleteInterval('agones:health');
    }

    async finish(requestShutdown = true) {
        if (this.finishedCalled) return;
        // Set state to finished
        if (this.game !== null) {
            this.game.state = GameState.FINISHED;
            await this.game.save();
        }
        // Request Agones to do a shutdown process
        if (requestShutdown) await this.agones.shutdown();
        this.finishedCalled = true;
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
        const player = this.playerService.getPlayerBySocket(client);
        this.playerService.removePlayer(player);
    }

    getGame() {
        return this.game;
    }

    setGame(game: GameDocument) {
        this.game = game;
    }

    async setGameState(gameState: GameState) {
        if (this.game === null) return;
        this.game.state = gameState;
        await this.game.save();
    }

    getLogger() {
        return this.logger;
    }

    getServer() {
        return this.server;
    }
}
