import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UserDocument } from 'src/users/entities/user.entity';
import { Player } from './player.entity';

@Injectable()
export class PlayersService {
    // mapping between user id and user document
    private players: Map<string, Player> = new Map();
    // Mapping between user id and socket
    private sockets: Map<string, Socket> = new Map();
    // Mapping between socket id and user id
    private socketIds: Map<string, string> = new Map();

    getPlayers() {
        return this.players;
    }

    getPlayerBySocket(socket: Socket) {
        return this.getPlayerBySocketId(socket.id);
    }

    getPlayerBySocketId(socketId: string) {
        return this.players.get(this.socketIds.get(socketId));
    }

    getPlayerById(uid: string) {
        return this.players.get(uid);
    }

    addPlayerRaw(socket: Socket, user: UserDocument) {
        this.addPlayer(this.makePlayer(socket, user));
    }

    addPlayer(player: Player) {
        // Store users details on the server
        this.sockets.set(player.uid, player.socket);
        this.players.set(player.uid, player);
        this.socketIds.set(player.socket.id, player.uid);
    }

    setPlayer(player: Player) {
        this.addPlayer(player);
    }

    removePlayer(player: Player) {
        this.socketIds.delete(player.uid);
        this.players.delete(player.uid);
        this.sockets.delete(player.uid);
    }

    removePlayerById(uid: string) {
        this.removePlayer(this.getPlayerById(uid));
    }

    makePlayer(socket: Socket, user: UserDocument): Player {
        return {
            uid: user.uid,
            user,
            socket,
        };
    }
}
