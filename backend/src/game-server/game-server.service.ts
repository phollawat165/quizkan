import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { GameServerGateway } from './gateway/game-server.gateway';
import { ModuleRef } from '@nestjs/core';
import { SchedulerRegistry } from '@nestjs/schedule';
import AgonesSDK from '@google-cloud/agones-sdk';
import { PlayersService } from './player/players.service';
import {
    FirebaseAuthenticationService,
    FirebaseMessagingService,
} from '@aginix/nestjs-firebase-admin';
import { GamesService } from 'src/game/games.service';
import { GameDocument } from 'src/game/entities/game.entity';
import { GameState } from 'src/game/game-state.enum';
import { Player } from './player/player.entity';
import { UserDocument } from 'src/users/entities/user.entity';
import { messaging } from 'firebase-admin';
import { Question, QuestionDocument } from 'src/game/entities/question.entity';
import _ from 'lodash';

@Injectable()
export class GameServerService implements OnModuleInit, OnModuleDestroy {
    constructor(
        private moduleRef: ModuleRef,
        private authService: AuthService,
        private schedulerRegistry: SchedulerRegistry,
        private playerService: PlayersService,
        private messagingService: FirebaseMessagingService,
        private gamesService: GamesService,
        private firebaseAuthService: FirebaseAuthenticationService,
    ) {}

    private TIME_PER_QUESTION = 20;
    private logger: Logger = new Logger(GameServerService.name);
    private server: Server;
    private agones: AgonesSDK = null;
    // Current game;
    private game: GameDocument = null;
    // Question
    private questions: Question[] = null;
    private currentQuestion = -1;
    private currentQuestionBroadcasted = false;
    private questionBroadcastedAt = Date.now();
    // Answer
    private answeredCount = 0;
    // If shutdown by user
    private finishedCalled = false;
    private agonesEnabled = false;
    // timer
    private time = 0;
    private question = false;
    // end
    private ended = false;

    async loop() {
        if (!this.game || this.game.state !== GameState.RUNNING) return;
        // Check state
        if (this.question) {
            // Timer is running
            if (!this.currentQuestionBroadcasted) {
                // Increase number
                this.currentQuestion++;
                // Broadcast question to all players
                this.broadcastQuestion();
                // Set broadcast time
                this.questionBroadcastedAt = Date.now();
                this.logger.log('Asking question no.' + this.currentQuestion);
                this.currentQuestionBroadcasted = true;
            }
            // Run timer
            this.broadcastTime();
            this.logger.log('Time left: ' + this.time);
            this.time--;
            // if times up -> change state
            if (this.time < 0) {
                this.logger.log('Times up');
                this.logger.log('Force question no.' + this.currentQuestion);
                this.playerService.forceAnswerAllPlayerIfNot(
                    this.currentQuestion,
                );
                this.setAskingTimedQuestion(false);
            }
        } else {
            // Time up
            if (this.currentQuestionBroadcasted) {
                // Broadcast answer
                this.broadcastAnswer();
                this.logger.log('The answer has been sent to all players');
                // Calculate score
                this.playerService.recalculateAllPlayerTotalScore();
                // Broadcast score
                this.broadcastScore();
            }
            this.currentQuestionBroadcasted = false;
        }
    }

    async handleAnswer(player: Player, payload: any) {
        // Player input
        const answerIdx = Number(payload.choice);
        // Error
        if (this.playerService.hasAnswered(player, this.currentQuestion)) {
            return {
                status: 'error',
                message: 'You have already answered this question.',
            };
        }
        // Current question
        const question = this.getCurrentQuestion();
        // Time and status
        const answeredAt = Date.now();
        let answered = false;
        // Check validity
        // idx is the choice no.
        for (let idx = 0; idx < question.choices.length; idx++) {
            // We found the choice
            if (idx === answerIdx) {
                // Retrieve information about that choice
                const choice = question.choices[idx];
                // Calculate score
                const score = choice.isCorrect
                    ? this.calculateScore(answeredAt)
                    : 0;
                // Record score
                this.playerService.answer(
                    player, // Current player
                    this.currentQuestion, // Current question (starts at 0)
                    idx, // Current selected choice (starts at 0)
                    answeredAt, // Timestamp in ms
                    score, // calculated score
                    choice.isCorrect, // is it correct?
                );
                answered = true;
                this.logger.log(
                    `Player ${player.user.displayName} answered, choice: ${idx}, score: ${score}, isCorrect: ${choice.isCorrect}`,
                );
                // Broadcast answered count
                this.answeredCount++;
                this.broadcastAnsweredCount();
            }
        }
        // If choice not found
        if (!answered) return { status: 'error', message: 'Choice not found!' };
        // Return OK
        return { status: 'OK', answeredAt, choice: answerIdx };
    }

    async handleSkip(player: Player) {
        if (this.isHost(player)) {
            // If currently asking a question
            if (this.question) {
                this.time = 0;
                return { status: 'OK' };
            }
            // If not then error
            else {
                return {
                    status: 'error',
                    message: 'Currently not asking a question',
                };
            }
        } else {
            return { status: 'error', message: 'Not a host' };
        }
    }

    async handleNextQuestion(player: Player) {
        if (this.isHost(player)) {
            // If currently asking a question
            if (this.question) {
                return {
                    status: 'error',
                    message: 'Current question is being asked',
                };
            }
            // If running out of question
            if (this.currentQuestion >= this.questions.length - 1) {
                if (this.endGame()) {
                    return {
                        status: 'OK',
                        message: 'Ending the game',
                    };
                } else {
                    return {
                        status: 'error',
                        message: 'The game has already ended',
                    };
                }
            }
            this.logger.log('Preparing to ask next question');
            // Reset answer count
            this.answeredCount = 0;
            // Broadcast next question in 5 second
            this.setAndShowTimer(5);
            const interval = setInterval(() => {
                // Broadcast current time
                this.broadcastTime();
                this.time--;
                // If the time has already come
                if (this.time < 0) {
                    // Set to asking question mode
                    this.setAskingTimedQuestion(true);
                    this.schedulerRegistry.deleteInterval(
                        'game-server:next-question',
                    );
                    this.logger.log('Next question started');
                }
            }, 1000);
            this.schedulerRegistry.addInterval(
                'game-server:next-question',
                interval,
            );
            // Prepare timer
            return { status: 'OK' };
        } else {
            return { status: 'error', message: 'Not a host' };
        }
    }

    async handleEnd(player: Player) {
        if (this.isHost(player)) {
            if (
                this.question &&
                this.game.state === GameState.RUNNING &&
                this.endGame()
            ) {
                return { status: 'OK' };
            } else {
                return { status: 'error', message: 'Invalid state' };
            }
        } else {
            return { status: 'error', message: 'Not a host' };
        }
    }

    async onModuleInit() {
        // Get Server instance
        this.server = this.moduleRef.get(GameServerGateway).getServer();
        this.logger.log('Loaded server instance');
        // Agones
        if (process.env.AGONES_ENABLED === 'true') {
            this.agones = this.moduleRef.get(AgonesSDK);
            this.agonesEnabled = true;
            this.setupAgones();
        }
        // Game loop
        this.schedulerRegistry.addInterval(
            'game-server:loop',
            setInterval(() => {
                this.loop();
            }, 1000),
        );
    }

    async onModuleDestroy() {
        this.schedulerRegistry.deleteInterval('game-server:loop');
        this.logger.log('Shutting down game server');
        await this.finish();
        // Agones
        if (this.agonesEnabled)
            this.schedulerRegistry.deleteInterval('agones:health');
    }

    async handleLogin(client: Socket) {
        if (this.game === null || this.game.state !== GameState.WAITING) {
            this.logger.log('Client disconnected: Server not ready');
            client.emit('message', {
                disconnected: true,
                message: 'Server not ready',
            });
            client.disconnect();
        } else {
            const user = await this.authService.validateUser(
                (client.handshake.auth as any).token,
            );
            // If invalid credentials
            if (!user) {
                client.emit('message', {
                    disconnected: true,
                    message: 'Incorrect credentials',
                });
                client.disconnect();
            } else if (this.playerService.getPlayerById(user.uid)) {
                client.emit('message', {
                    disconnected: true,
                    message: 'You are already logged in from somewhere!',
                });
                client.disconnect();
            } else {
                // Store users details on the server
                const newPlayer = this.playerService.addPlayerRaw(
                    client,
                    user,
                    this.checkIsHost(user),
                );
                const name =
                    (await this.firebaseAuthService.getUser(user.uid))
                        .displayName ||
                    (client.handshake.auth as any).displayName ||
                    'player';
                // Sync display name
                newPlayer.user.displayName = name;
                await newPlayer.user.save();
                // Send welcome message
                this.sendNotification(user, {
                    title: 'QuizKan',
                    body: `Welcome ${name} to the game`,
                });
                // Send login success
                client.emit('message', {
                    message: 'Login success',
                    user: user.toJSON(),
                    displayName: name,
                    time: newPlayer.joinedAt,
                });
                // Broadcast players in the server
                this.broadcastNewPlayer(user);
                this.logger.log(`User ${user.uid} logged in`);
            }
        }
    }

    async handleDisconnect(client: Socket) {
        // Remove users details on the server
        if (this.playerService.getPlayerBySocket(client) == null) {
            return;
        }
        const player = this.playerService.getPlayerBySocket(client);
        this.playerService.removePlayer(player);
        this.broadcastNewPlayer(null);
    }

    async handleHost(client: Socket) {
        const player = this.playerService.getPlayerBySocket(client);
        if (player && this.isHost(player)) {
            player.socket.emit('setHost', { host: true });
            return { status: 'OK' };
        } else {
            client.emit('message', {
                disconnected: true,
                message: 'You are not the host.',
            });
            player.socket.disconnect();
            return { status: 'error', message: 'You are not the host.' };
        }
    }

    async startGame(player: Player) {
        if (this.isHost(player)) {
            if (this.game.state !== GameState.WAITING) {
                return { status: 'error', message: 'Illegal state' };
            }
            // Load questions
            await this.loadQuizData();
            // show timer
            this.setAndShowTimer(5);
            // tells
            this.server.sockets.emit('start');
            this.logger.log('Starting the game');
            // broadcast status
            for (const [, player] of this.playerService.getPlayers()) {
                this.sendNotification(player.user, {
                    title: 'QuizKan',
                    body: 'Game starting soon',
                });
            }
            // Countdown
            this.schedulerRegistry.addInterval(
                'game-server:start',
                setInterval(() => {
                    this.broadcastTime();
                    this.time--;
                    if (this.time < 0) {
                        this.schedulerRegistry.deleteInterval(
                            'game-server:start',
                        );
                        // Mark as running
                        this.setGameState(GameState.RUNNING);
                        // Set asking question = true
                        this.setAskingTimedQuestion(true);
                        this.logger.log('Game started');
                    }
                }, 1000),
            );
            return { status: 'OK' };
        } else {
            return { status: 'error', message: 'You are not a host' };
        }
    }

    async loadQuizData() {
        await this.game.populate('quiz').execPopulate();
        this.questions = this.game.quiz.questions;
    }

    setAskingTimedQuestion(asking: boolean) {
        this.question = asking;
        if (this.question) this.time = this.TIME_PER_QUESTION;
        else this.time = 0;
        this.broadcastQuestionState();
    }

    setAndShowTimer(whatTime = 5) {
        // show timer
        this.server.sockets.emit('showTimer');
        this.time = whatTime;
    }

    endGame(): boolean {
        if (this.ended) return false;
        this.ended = true;
        // Set game state = finished
        this.setGameState(GameState.FINISHED);
        // Broadcast game result
        this.logger.log('Final score broadcasted');
        this.broadcastScore();
        this.logger.log('Game ended');
        return true;
    }

    broadcastTime() {
        this.server.sockets.emit('setTime', {
            time: this.time >= 0 ? this.time : 0,
        });
    }

    broadcastState() {
        this.server.sockets.emit('setState', {
            state: this.game.state,
        });
    }

    broadcastQuestionState() {
        this.server.sockets.emit('setQuestionState', {
            question: this.question,
        });
    }

    broadcastQuestion() {
        const question = (this.questions[
            this.currentQuestion
        ] as QuestionDocument).toJSON();
        question.choices = question.choices.map((choice) => {
            return { name: choice.name, order: choice.order, isCorrect: false };
        }) as any;
        this.server.sockets.emit('setQuestion', question);
    }

    broadcastAnsweredCount() {
        this.server.sockets.emit('setAnsweredCount', {
            count: this.answeredCount,
        });
    }

    broadcastAnswer() {
        this.server.sockets.emit(
            'setAnswer',
            this.questions[this.currentQuestion],
        );
    }

    broadcastScore() {
        // Emit scoreboard
        this.server.sockets.emit('setScore', {
            scoreboard: this.playerService.getScoreboard(),
        });
        // For all players
        for (const [, player] of this.playerService.getPlayers()) {
            // Skip if host
            if (player.isHost) continue;
            const socket = player.socket;
            // Send personal score
            socket.emit('setPersonalScore', {
                uid: player.uid,
                displayName: player.user.displayName,
                totalScore: player.totalScore,
                answers: player.answers,
            });
        }
    }

    broadcastNewPlayer(user: UserDocument) {
        // Broadcast players
        const players = [];
        let lastPlayer = null;
        // For each players
        for (const [, player] of this.playerService.getPlayers().entries()) {
            if (player.isHost) continue;
            // Create player entry
            const tempPlayer = {
                uid: player.uid,
                displayName: player.user.displayName,
                isHost: this.isHost(player),
                joinedAt: player.joinedAt,
            };
            // Set as last player
            if (user && player.uid === user.uid) lastPlayer = tempPlayer;
            players.push(tempPlayer);
        }
        this.server.sockets.emit('setPlayers', {
            count: players.length,
            players: players,
            lastPlayer,
        });
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestion];
    }

    isHost(player: Player) {
        return player.isHost;
    }

    canAnswer() {
        return (
            this.game.state === GameState.RUNNING &&
            this.time > 0 &&
            this.question
        );
    }

    private checkIsHost(user: UserDocument) {
        const hostUser = this.game.host;
        return user.id == hostUser || user.id == (hostUser as UserDocument).id;
    }

    private calculateScore(currentTime: number) {
        const timePerQuestion = this.TIME_PER_QUESTION * 1000;
        const timesUpAt = this.questionBroadcastedAt + timePerQuestion;
        const deltaTime = Math.max(0, timesUpAt - currentTime);
        return Math.ceil((deltaTime / timePerQuestion) * 1000);
    }

    async sendNotification(
        user: UserDocument,
        message: messaging.NotificationMessagePayload,
        delay = 0,
    ) {
        return new Promise<void>((res, rej) => {
            setTimeout(() => {
                if (user.devices && user.devices.length > 0) {
                    const tokens = [];
                    for (const device of user.devices) {
                        if (!tokens.includes(device.token)) {
                            tokens.push(device.token);
                        }
                    }
                    try {
                        this.messagingService.sendToDevice(tokens, {
                            notification: message,
                        });
                        res();
                    } catch (err) {
                        rej(err);
                    }
                }
            }, delay);
        });
    }

    async setupAgones() {
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

    async finish(requestShutdown = true) {
        if (this.finishedCalled) return;
        // Set state to finished
        if (this.game !== null) {
            this.game.state = GameState.FINISHED;
            await this.game.save();
        }
        // Request Agones to do a shutdown process
        if (requestShutdown && this.agonesEnabled) await this.agones.shutdown();
        else if (requestShutdown) {
            this.schedulerRegistry.addTimeout(
                'shutdown',
                setTimeout(() => {
                    process.kill(process.pid, 'SIGTERM');
                }, 1000),
            );
        }
        this.finishedCalled = true;
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
        this.broadcastState();
    }

    getLogger() {
        return this.logger;
    }

    getServer() {
        return this.server;
    }

    getPlayerService() {
        return this.playerService;
    }
}
