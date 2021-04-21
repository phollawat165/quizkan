import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import { createAdapter } from 'socket.io-redis';
import { RedisClient } from 'redis';
import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class RedisIoAdapter extends IoAdapter {
    private app: INestApplicationContext;
    constructor(appOrHttpServer?: INestApplicationContext | any) {
        super(appOrHttpServer);
        this.app = appOrHttpServer;
    }
    createIOServer(port: number, options?: any): any {
        const config = this.app.get(ConfigService);
        const server: Server = super.createIOServer(port, options);
        const pubClient = new RedisClient({
            host: config.get('REDIS_HOST', 'localhost'),
            port: Number.parseInt(config.get<string>('REDIS_PORT', '6379')),
        });
        const subClient = pubClient.duplicate();
        const redisAdapter = createAdapter({ pubClient, subClient });

        server.adapter(redisAdapter);
        return server;
    }
}
