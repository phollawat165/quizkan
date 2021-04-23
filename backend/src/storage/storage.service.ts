import { BlobServiceClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
    private connectionString: string;
    private blobClient: BlobServiceClient = null;
    private enabled = false;
    constructor(private configService: ConfigService) {
        this.connectionString = configService.get<string>(
            'AZURE_STORAGE_CONNECTION_STRING',
            null,
        );
        this.enabled =
            configService.get<string>('AZURE_STORAGE_ENABLED', 'false') ===
            'true';
        this.init();
    }

    private init() {
        if (this.enabled)
            this.blobClient = BlobServiceClient.fromConnectionString(
                this.connectionString,
            );
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    getBlobClient(): BlobServiceClient | null {
        return this.blobClient;
    }
}
