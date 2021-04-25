import AgonesSDK from '@google-cloud/agones-sdk';
import { Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/role/roles.decorator';
import { GameState } from 'src/game/game-state.enum';
import { GameServerService } from '../game-server.service';

@Controller('admin')
export class AdminController {
    constructor(
        private agones: AgonesSDK,
        private gameServerService: GameServerService,
    ) {}

    @Get()
    @Public()
    index() {
        return;
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
        return this.gameServerService.getGame();
    }

    @Post('run')
    @Roles(Role.Admin)
    async run() {
        const game = this.gameServerService.getGame();
        game.state = GameState.RUNNING;
        return await game.save();
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
