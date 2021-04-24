import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Request,
    ServiceUnavailableException,
} from '@nestjs/common';
import { Role } from 'src/auth/role/role.enum';
import { Roles } from 'src/auth/role/roles.decorator';
import { CreateGameDto } from 'src/game/dto/create-game.dto';
import { GameState } from 'src/game/game-state.enum';
import { GamesService } from 'src/game/games.service';
import { QuizzesService } from 'src/game/quizzes.service';
import { UserDocument } from 'src/users/entities/user.entity';
import { AllocatorService } from '../allocator.service';

// const allocation = {
//     apiVersion: 'allocation.agones.dev/v1',
//     kind: 'GameServerAllocation',
//     spec: {
//         required: {
//             matchLabels: {
//                 'agones.dev/fleet': 'quizkan-gameserver',
//             },
//         },
//         metadata: {
//             labels: {
//                 mode: 'normal',
//             },
//             annotations: {
//                 gameId: '',
//                 host: '',
//                 quiz: '',
//             },
//         },
//     },
// };

// const kc = new k8s.KubeConfig();
// kc.loadFromCluster();
// const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);
// k8sApi.createNamespacedCustomObject(
//     'allocation.agones.dev',
//     'v1',
//     'default',
//     'gameserverallocations',
//     allocation,
// );
@Controller('/games')
export class GamesController {
    constructor(
        private allocatorService: AllocatorService,
        private gamesService: GamesService,
        private quizzesService: QuizzesService,
    ) {}

    @Post()
    async create(
        @Body() createGameDto: CreateGameDto,
        @Request() request: Express.Request,
    ) {
        // Only instances running inside Kubernetes cluster can do this
        if (!process.env.KUBERNETES_SERVICE_HOST) {
            throw new BadRequestException(
                'Only the instance inside Kubernetes Cluster can be called',
            );
        }
        // Validate quiz id, TODO: Move to validator
        if (
            !this.quizzesService.getModel().exists({ _id: createGameDto.quiz })
        ) {
            throw new BadRequestException(
                `Quiz id ${createGameDto.quiz} not found`,
            );
        }
        // Create game
        const game = await this.gamesService.create(
            createGameDto,
            request.user as UserDocument,
        );
        // Try to allocate an instance to the game
        const allocationResult = await this.allocatorService.allocateGameServer(
            game,
        );
        if (allocationResult === null) {
            throw new InternalServerErrorException('Something went wrong');
        }
        // If there are no game servers avaiable
        if (allocationResult.status.state === 'UnAllocated') {
            await this.gamesService.remove(game.id);
            throw new ServiceUnavailableException(
                'There are no game servers available at this moment, please try again later',
            );
        }
        // Assign url and port to the game
        game.url = allocationResult.status.address;
        game.port =
            allocationResult.status.ports.length > 0
                ? allocationResult.status.ports[0].port
                : null;
        game.state = GameState.WAITING;
        // Return game data
        return game.save();
    }

    @Get('/code/:code')
    async getByCode(@Param('code') code: string) {
        const game = await this.gamesService.findByCode(
            code,
            GameState.WAITING,
        );
        if (!game) throw new NotFoundException();
        return game;
    }

    @Get('/:id')
    async getById(@Param('id') id: string) {
        const game = await this.gamesService.findOne(id);
        if (!game) throw new NotFoundException();
        return game;
    }

    @Post('/admin/allocate')
    @Roles(Role.Admin)
    async allocate() {
        if (!process.env.KUBERNETES_SERVICE_HOST) {
            throw new BadRequestException(
                'Only the instance inside Kubernetes Cluster can be called',
            );
        }
        return this.allocatorService.allocateGameServer(null);
    }
}
