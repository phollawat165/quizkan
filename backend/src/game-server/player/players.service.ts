import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { Socket } from 'socket.io';
import { UserDocument } from 'src/users/entities/user.entity';
import { Player } from './player.entity';

export interface Scoreboard {
    player: { uid: string; displayName: string };
    totalScore: number;
}

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

    addPlayerRaw(socket: Socket, user: UserDocument, isHost): Player {
        return this.addPlayer(this.makePlayer(socket, user, isHost));
    }

    addPlayer(player: Player) {
        // Store users details on the server
        this.sockets.set(player.uid, player.socket);
        this.players.set(player.uid, player);
        this.socketIds.set(player.socket.id, player.uid);
        return player;
    }

    setPlayer(player: Player): Player {
        return this.addPlayer(player);
    }

    hasPlayer(uid: string) {
        return this.players.has(uid);
    }

    removePlayer(player: Player) {
        this.socketIds.delete(player.uid);
        this.players.delete(player.uid);
        this.sockets.delete(player.uid);
    }

    removePlayerById(uid: string) {
        this.removePlayer(this.getPlayerById(uid));
    }

    hasAnswered(player: Player, questionNumber: number) {
        return questionNumber in player.answers;
    }

    answer(
        player: Player,
        questionNumber: number,
        choice: number,
        time: number,
        score: number,
        isCorrect: boolean,
    ): boolean {
        if (questionNumber in player.answers) return false;
        player.answers[questionNumber] = {
            choice,
            time,
            score,
            isCorrect,
        };
        return true;
    }

    forceAnswerIfNot(player: Player, questionNumber: number) {
        if (questionNumber in player.answers) return;
        player.answers[questionNumber] = {
            choice: -1,
            time: 0,
            score: 0,
            isCorrect: false,
        };
    }

    forceAnswerAllPlayerIfNot(questionNumber: number) {
        for (const [, player] of this.players.entries()) {
            this.forceAnswerIfNot(player, questionNumber);
        }
    }

    recalculateTotalScore(player: Player) {
        let score = 0;
        // For each question
        for (const questionNo in player.answers) {
            const answer = player.answers[questionNo];
            score += answer.score;
        }
        player.totalScore = score;
    }

    recalculateAllPlayerTotalScore() {
        for (const [, player] of this.players.entries()) {
            this.recalculateTotalScore(player);
        }
    }

    getScoreboard() {
        const scoreboard: Scoreboard[] = [];
        for (const [, player] of this.players.entries()) {
            if (player.isHost) continue;
            scoreboard.push({
                player: {
                    uid: player.uid,
                    displayName: player.user.displayName,
                },
                totalScore: player.totalScore,
            });
        }
        return _.sortBy(scoreboard, ['totalScore']).reverse();
    }

    makePlayer(socket: Socket, user: UserDocument, isHost: boolean): Player {
        return {
            uid: user.uid,
            user,
            socket,
            answers: {},
            joinedAt: Date.now(),
            totalScore: 0,
            isHost,
        };
    }
}
