import AgonesSDK from '@google-cloud/agones-sdk';
import { Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/role/roles.decorator';

@Controller('admin')
export class AdminController {
    constructor(private agones: AgonesSDK) {}

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

    @Post('shutdown')
    @Roles(Role.Admin)
    async shutdown() {
        await this.agones.shutdown();
    }

    @Post('allocate')
    @Roles(Role.Admin)
    async allocate() {
        await this.agones.allocate();
    }
}
