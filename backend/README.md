## Description

QuizKan backend created using [Nest](https://github.com/nestjs/nest) framework.

## Installation

0. Make sure you are in the /backend directoy
1. Setup Azurite (Azure Storage Emulator), MongoDB, Firebase Emulator and Redis.
2. Modify .env file according to the example. Don't forget Firebase private key!
3. Run the following command to install dependencies.

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Building and running using Docker

Make sure you are in the /backend directoy

Example if other services are running in the host machine

Powershell

```powershell
docker build -t quizkan-backend .
docker run -d --env-file .env `
-e "REDIS_ENABLED=true" `
-e "REDIS_HOST=host.docker.internal" `
-e "AZURE_STORAGE_ENABLED=true" `
-e "AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://host.docker.internal:10000/devstoreaccount1;" `
-e "MONGODB_URI=mongodb://host.docker.internal:27017/quizkan" `
-e "PORT=8000" `
-p 8000:8000 quizkan-backend
```

Bash

```bash
$ docker build -t quizkan-backend .
$ docker run -d --env-file .env \
-e "REDIS_ENABLED=true" \
-e "REDIS_HOST=host.docker.internal" \
-e "AZURE_STORAGE_ENABLED=true" \
-e "AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://host.docker.internal:10000/devstoreaccount1;" \
-e "MONGODB_URI=mongodb://host.docker.internal:27017/quizkan" \
-e "PORT=8000" \
-p 8000:8000 quizkan-backend
```
