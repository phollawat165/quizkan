import AgonesSDK from '@google-cloud/agones-sdk';
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Post,
    Request,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { Public } from 'src/auth/public.decorator';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/role/roles.decorator';
import { GameState } from 'src/game/game-state.enum';
import { GamesService } from 'src/game/games.service';
import { UserDocument } from 'src/users/entities/user.entity';
import { GameServerService } from '../game-server.service';

@Controller('admin')
export class AdminController {
    constructor(
        private agones: AgonesSDK,
        private gameServerService: GameServerService,
        private gamesService: GamesService,
    ) {}

    @Get()
    @Public()
    index() {
        return { message: 'Only authorized user can access this resource.' };
    }

    @Post('health')
    @Roles(Role.Admin)
    healthPing() {
        this.agones.health();
    }

    @Get('game-server')
    @Roles(Role.Admin)
    async getGameServer() {
        const gs = await this.agones.getGameServer();
        return gs;
    }

    @Get('game')
    @Roles(Role.Admin)
    async getGame() {
        const game = this.gameServerService.getGame();
        if (!game)
            throw new NotFoundException('No game is running on this server');
        return game;
    }

    @Post('game')
    @Roles(Role.Admin)
    async setGame(@Body() body: any, @Request() req: Express.Request) {
        if (!body) throw new BadRequestException();
        if (this.gameServerService.getGame()) {
            throw new BadRequestException(
                'There is already a game running on this server. Please restart the server to change to a different game.',
            );
        }
        if (!body.quiz || !isValidObjectId(body.quiz)) {
            throw new BadRequestException('quiz is not a valid object id');
        }
        const game = await this.gamesService.create(
            body,
            req.user as UserDocument,
        );
        game.state = GameState.WAITING;
        await game.save();
        this.gameServerService.setGame(game);
        return game;
    }

    @Post('run')
    @Roles(Role.Admin)
    async run() {
        const game = this.gameServerService.getGame();
        if (game === null) {
            throw new BadRequestException(
                'No game is running on this server. Please set the game first.',
            );
        } else if (game.state != GameState.WAITING) {
            throw new BadRequestException(
                'The game has already started and is currently running or the game has already finished.',
            );
        }
        game.state = GameState.RUNNING;
        return await game.save();
    }

    @Post('finish')
    @Roles(Role.Admin)
    async finish() {
        const game = this.gameServerService.getGame();
        if (game === null) {
            throw new BadRequestException(
                'No game is running on this server. Please set the game first.',
            );
        } else if (game.state !== GameState.RUNNING) {
            throw new BadRequestException(
                'Only running game can be marked as finished',
            );
        }
        await this.gameServerService.finish();
        return game;
    }

    @Post('shutdown')
    @Roles(Role.Admin)
    async shutdown() {
        await this.gameServerService.finish();
        return this.gameServerService.getGame();
    }

    @Post('allocate')
    @Roles(Role.Admin)
    async allocate() {
        await this.agones.allocate();
    }
}
