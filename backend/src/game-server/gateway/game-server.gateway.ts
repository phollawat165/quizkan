import AgonesSDK from '@google-cloud/agones-sdk';
import { Logger } from '@nestjs/common';
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
    ) {}

    afterInit(server: Server) {
        this.logger.log('Server running in GAME-SERVER mode');
        this.logger.log('WebSocket Gateway initialized');
        this.agones.connect().then(() => {
            this.agones.ready().then(() => {
                this.logger.log('Server is now ready for the game.');
            });
        });
    }

    async handleConnection(client: Socket, ...args: any[]) {
        this.logger.log('Client connected');
        this.gameServerService.handleLogin(client);
    }

    async handleDisconnect(client: Socket) {
        this.gameServerService.handleDisconnect(client);
        this.logger.log('Client disconnected');
    }

    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: any): string {
        return 'Hello world!';
    }

    @SubscribeMessage('send_start')
    async listenForStart(
        @MessageBody() content,
        @ConnectedSocket() socket: Socket,
      ) {
        // const sender = await this.userService.findById(1);
        this.server.sockets.emit("recieve_start", {
          id: content.roomID
        });
      }

    @SubscribeMessage('send_number_of_choices')
      async listenForChoice(
          @MessageBody() content,
          @ConnectedSocket() socket: Socket,
        ) {
          // const sender = await this.userService.findById(1);
          this.server.sockets.emit("recieve_number_of_choices", {
            id: content.roomID,
            question: content.question,
            choices: content.choice
          });
        }
    
    @SubscribeMessage('send_correct_choices')
        async listenForCorrectAnswer(
            @MessageBody() content,
            @ConnectedSocket() socket: Socket,
          ) {
            // const sender = await this.userService.findById(1);
            this.server.sockets.emit("recieve_correct_choices", {
              id: content.roomID,
              choices: content.choice
            });
          }
  

    getServer(): Server {
        return this.server;
    }
}
