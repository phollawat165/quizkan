## Description

QuizKan backend created using [Nest](https://github.com/nestjs/nest) framework.

## Development Requirements

1. Fast CPU with >= 4 cores
2. Memory >= 8GB (we use 16GB Machine for local development)
3. OS: Windows, Linux, macOS
4. NodeJS >= 14
5. Modern Web Browser
6. IDE of your choice (We use Visual Studio Code)
7. Kubernetes Environment (We use Minikube with WSL2 driver. We have never tried with macOS or Linux)

## Guides for each Dependencies

1. Agones SDK for Local Development: https://agones.dev/site/docs/guides/client-sdks/local/
2. Firebase CLI (in which Firebase Emulator is bundled): `npm -g install firebase-tools` or download form https://firebase.google.com/docs/cli
3. MongoDB: https://docs.mongodb.com/manual/administration/install-community/
4. Redis: https://redis.io/topics/quickstart , Note: Only avaiable in Linux and macOS but you can also run it in the container.
5. Google Cloud Storage Emulator: https://github.com/fsouza/fake-gcs-server or S3 Compatible Storage Emulator

## Installation

0. Make sure you are in the /backend directoy
1. Setup MongoDB, Firebase Emulator, Cloud Storage Emulator, Agones SDK Server and Redis.
2. Modify .env file according to the example. Don't forget Firebase private key!
3. Run the following command to install dependencies.

```bash
$ yarn
```

## Running the app

Available environment variables are in .env.example file.

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Overriding Environment Variables From Shell

### Using cross-env for modifying environment variable across a platform

Install cross-env globally using npm or yarn. Note that environment variables from shell have higher priority than from .env file.

```bash
# Example of running in the game server mode with --watch option (Hot reloading)
$ cross-env HOST=127.0.0.1 PORT=8000 MODE=game yarn start:dev
```

### Using env-cmd as alterative to cross-env

Install it globally using npm or yarn. Firstly, create the custom .env file e.g, .env.local. After that, run the following command to load environment variables from .env.local

```bash
$ env-cmd -f .env.local yarn start
```

More exmaple at https://github.com/toddbluhm/env-cmd

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
-e "MONGODB_URI=mongodb://host.docker.internal:27017/quizkan" \
-e "PORT=8000" \
-p 8000:8000 quizkan-backend
```

## Deploying Kubernetes Cluster

1. Create a secret containing Firebase private key and/or mongodb uri, remove --edit flag if the private key is already in place. **Note: the secret value must be base64 encoded.**

```bash
$ kubectl create --edit -f secret.yaml
```

2. (This step will varies according to your container registry in which the image is located) Create a secret which contains image pull secret. Below is the example of how to create and use image pull secret file. You can find more details at [Kubernetes Documentation](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)

    2.1 Here's an example of config.json found in ~/.docker/. You may generate this file by issuing `docker login <registry-url>`.

    ```json
    {
        "auths": {
            "ghcr.io": {
                "auth": "REDACTED"
            }
        }
    }
    ```

    2.2 Create file named regcred.yaml where .dockerconfigjson is a based64 encoded content of config.json in the step 2.1

    ```yaml
    apiVersion: v1
    data:
        .dockerconfigjson: REDACTED # base64 encoded of the content in config.json
    kind: Secret
    metadata:
        name: regcred
    type: kubernetes.io/dockerconfigjson
    ```

3. Apply configuration by running

```bash
$ kubectl apply -f config.yaml
```

4. Setup Redis and MongoDB service by running the following commands

    - Local development environment

    ```bash
    $ kubectl apply -f ../mongo/service-local.yaml
    $ kubectl apply -f ../redis/service-local.yaml
    $ kubectl patch endpoints redis --patch '{"subsets": [{"addresses": [{"ip": "'$( minikube ssh 'grep host.minikube.internal /etc/hosts | cut -f1' | tr -d '[:space:]')'"}]}]}'
    $ kubectl patch endpoints mongo --patch '{"subsets": [{"addresses": [{"ip": "'$( minikube ssh 'grep host.minikube.internal /etc/hosts | cut -f1' | tr -d '[:space:]')'"}]}]}'
    ```

    - Production environment

        TODO: Create an external endpoint to Redis service and MongoDB Atlas

5. Apply deployment by running

```bash
$ kubectl apply -f deployment.yaml
```

6. Expose the deployment by running

```bash
$ kubectl expose deployment quizkan-backend-deployment --type=LoadBalancer --port=8000
```

7. Setup service account role binding to allow the lobby to allocate the game server

```bash
$ kubectl apply -f rolebinding.yaml
```

8. Setup game fleet and fleet autoscaler

```bash
$ kubectl apply -f fleet.yaml
```

9. (Minikube Only) Open another terminal and run the follwing command. Do not close the terminal.

```bash
$ minikube tunnel
```

10. View the service by running.

```bash
$ kubectl get service
$ kubectl get gs
```

11. (Minikube Only) Forward port to the game server by running

```bash
$ kubectl port-forward quizkan-gameserver-xxxx-yyyy 7xxx:8000
```
