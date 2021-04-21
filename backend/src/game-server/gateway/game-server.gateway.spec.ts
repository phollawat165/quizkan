import { Test, TestingModule } from '@nestjs/testing';
import { GameServerGateway } from './game-server.gateway';

describe('GameServerGateway', () => {
    let gateway: GameServerGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GameServerGateway],
        }).compile();

        gateway = module.get<GameServerGateway>(GameServerGateway);
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
});
