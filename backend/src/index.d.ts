declare module '@google-cloud/agones-sdk' {
    /**
     * Representation of the K8s ObjectMeta resource
     */
    export interface ObjectMeta {
        name: string;
        namespace: string;
        uid: string;
        resourceVersion: string;
        generation: number;
        creationTimestamp: number;
        deletionTimestamp: number;
        annotationsMap: Record<string, string>;
        labelsMap: Record<string, string>;
    }

    export interface Health {
        disabled: boolean;
        periodSeconds: number;
        failureThreshold: number;
        initialDelaySeconds: number;
    }

    export interface Spec {
        health: Health;
    }

    export interface Port {
        name: string;
        port: number;
    }

    export interface PlayerStatus {
        count: number;
        capacity: number;
        idsList: string[];
    }

    export interface Status {
        state: string;
        address: string;
        portsList: Port[];
        players: PlayerStatus;
    }

    /**
     * A GameServer Custom Resource Definition object
     * We will only export those resources that make the most
     * sense. Can always expand to more as needed.
     */
    export interface GameServer {
        objectMeta: ObjectMeta;
        spec: Spec;
        status: Status;
    }
    export default class AgonesSDK {
        /**
         * Create a new SDK instance, and connects to localhost on port 9357.
         * On the development environment, you can override the SDK port by setting `AGONES_SDK_GRPC_PORT` env var.
         */
        constructor();
        /**
         * Get the Agones SDK GRPC Port
         */
        get port(): string;
        /**
         * Connect to Agones Server
         */
        connect(): Promise<void>;
        /**
         * Close the connection to SDK
         */
        close(): void;
        /**
         * This tells Agones that the Game Server is ready to take player connections.
         * Once a Game Server has specified that it is Ready, then the Kubernetes GameServer record will be moved to the Ready state,
         * and the details for its public address and connection port will be populated.
         *
         * While Agones prefers that Shutdown() is run once a game has completed to delete the GameServer instance,
         * if you want or need to move an Allocated GameServer back to Ready to be reused,
         * you can call this SDK method again to do this.
         */
        ready(): Promise<void>;

        /**
         * Mark the game server as ALLOCATED
         */
        allocate(): Promise<void>;

        /**
         * This tells Agones to shut down the currently running game server.
         * The GameServer state will be set Shutdown and the backing Pod will be Terminated.
         *
         * As a rule of thumb, implement a graceful shutdown in your game sever process when it
         * receives the TERM signal from Kubernetes when the backing Pod goes into Termination state.
         * Be aware that if you use a variation of System.exit(0) after calling SDK.Shutdown(),
         * your game server container may restart for a brief period,
         * inline with our [Health Checking](https://agones.dev/site/docs/guides/health-checking/#health-failure-strategy) policies
         */
        shutdown(): Promise<void>;

        /**
         * This sends a single ping to designate that the Game Server is alive and healthy.
         * Failure to send pings within the configured thresholds will result in the GameServer being marked as Unhealthy.
         */
        health(): void;

        /**
         * This returns most of the backing GameServer configuration and Status.
         * This can be useful for instances where you may want to know Health check configuration,
         * or the IP and Port the GameServer is currently allocated to.
         */
        getGameServer(): Promise<GameServer>;

        /**
         * This executes the passed in callback with the current GameServer details
         * whenever the underlying GameServer configuration is updated.
         * This can be useful to track GameServer > Status > State changes,
         * metadata changes, such as labels and annotations, and more.
         * @param callback A callback function which will be called when the GameServer changes
         */
        watchGameServer(callback: (gameServer: GameServer) => any): void;

        /**
         * This will set a Label value on the backing GameServer record that is stored in Kubernetes.
         * @param key Key
         * @param value Value
         */
        setLabel(key: string, value: any): Promise<void>;

        /**
         * This will set an Annotation value on the backing GameServer record that is stored in Kubernetes.
         * @param key Key
         * @param value Value
         */
        setAnnotation(key: string, value: any): Promise<void>;

        /**
         * Move the GameServer into the Reserved state for the specified number of seconds (0 is forever),
         * and then it will be moved back to Ready state. While in Reserved state,
         * the GameServer will not be deleted on scale down or Fleet update,
         * and also it could not be Allocated using GameServerAllocation.
         * @param duration Duration for which the game server is reserved
         */
        reserve(duration: number): Promise<void>;
    }
}
