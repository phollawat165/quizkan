import { Injectable } from '@nestjs/common';
import {
    KubernetesObject,
    KubeConfig,
    CustomObjectsApi,
} from '@kubernetes/client-node';
import { GameDocument } from 'src/game/entities/game.entity';
import { QuizDocument } from 'src/game/entities/quiz.entity';

export interface GameServerAllocation extends KubernetesObject {
    spec: {
        multiClusterSetting: {
            policySelector: any;
        };
        required: {
            matchLabels: Record<string, any>;
        };
        scheduling: string;
        metadata: {
            labels: Record<string, any>;
            annotations: Record<string, any>;
        };
    };
    status: {
        state: string;
        gameServerName: string;
        ports: { name: string; port: number }[];
        address: string;
        nodeName: string;
    };
}

@Injectable()
export class AllocatorService {
    private k8sApi: CustomObjectsApi;
    constructor(private kubeConfig: KubeConfig) {
        if (process.env.KUBERNETES_SERVICE_HOST)
            this.k8sApi = kubeConfig.makeApiClient(CustomObjectsApi);
    }

    async allocateGameServer(
        game: GameDocument,
    ): Promise<GameServerAllocation> {
        if (!this.k8sApi) return;
        try {
            const allocation = this.makeAllocationObject(game);
            const result = await this.k8sApi.createNamespacedCustomObject(
                'allocation.agones.dev',
                'v1',
                'default',
                'gameserverallocations',
                allocation,
            );
            return result.body as GameServerAllocation;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    makeAllocationObject(game: GameDocument, fleetName = 'quizkan-gameserver') {
        if (!this.k8sApi) return;
        return {
            apiVersion: 'allocation.agones.dev/v1',
            kind: 'GameServerAllocation',
            spec: {
                required: {
                    matchLabels: {
                        'agones.dev/fleet':
                            fleetName ||
                            process.env.FLEET_NAME ||
                            'quizkan-gameserver',
                    },
                },
                metadata: {
                    labels: {
                        mode: 'normal',
                    },
                    annotations: {
                        gameId: game?.id,
                        host: game?.host?.uid,
                        quiz: game.populated('quiz')
                            ? (game?.quiz as QuizDocument)?.id
                            : game?.quiz?.toString(),
                    },
                },
            },
        };
    }
}
