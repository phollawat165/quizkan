# Prerequisite 
<strong>Before running our project in any method, the following steps must be done:</strong>
<ul>
<li>Download our project on: https://github.com/zuikaru/quizkan<br>
  Or clone our project on main branch using: https://github.com/zuikaru/quizkan.git</li>
<li>Sign up or sign in to Google Cloud and Firebase and create a new project, Firebase Spark plan is enough for our project.</li>
</ul>

<strong>Setup the development environment:</strong>
<ul>
<li>Prepare at least 8GB memory.</li>
<li>Docker Desktop, Minikube</li>
<li>IDE of your choice: e.g., VSCode</li>
<li>NodeJS > 14, yarn package manager</li>
<li>MongoDB Community Server</li>
<li>Firebase CLI (Firebase CLI reference (google.com))</li>
<li>Google Cloud SDK (If you want to use Google Container Registry or use kubectl on your machine)</li>
<li>Agones SDK emulator (Local Development | Agones): Although not necessary, it can be useful to debug game server lifecycle.</li>
<li>Setup container registry to host the Docker image.</li>
<li>Setup image pull secret for Kubernetes. (If hosted on private registry) Pull an Image from a Private Registry | Kubernetes</li>
</ul>

<strong>Prepare cloud service configuration</strong>
<ul>
<li>MongoDB Atlas credentials</li>
<li>Firebase configuration</li>
<li>Firebase Admin SDK credentials</li>
</ul>

# Building
<strong>(Note: In the production setting, .env variable should be stored in a secret manager and exposed via container runtime.)</strong>
<p> Frontend (Make sure your are in <strong>/frontend </strong>folder)<br>
Change the .env as follows:
</p>

```
# Server
NEXT_PUBLIC_API_ENDPOINT="http://localhost:8000"
NEXT_PUBLIC_LOBBY_SERVER_ENDPOINT=$NEXT_PUBLIC_API_ENDPOINT

# Firebase
# Config
NEXT_PUBLIC_FIREBASE_API_KEY=<Your API Key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<Your Auth Domain>
NEXT_PUBLIC_FIREBASE_DATABASE_URL=<Your DB URL>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<Your Project ID>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<Your Storage Bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<Your Message Sender ID>
NEXT_PUBLIC_FIREBASE_APP_ID=<Your App ID>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<Your Measurement ID>
NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID_KEY=<Your VAPID key>

# Options
NEXT_PUBLIC_FIREBASE_ENABLE_ANALYTICS=false
NEXT_PUBLIC_FIREBASE_ENABLE_PERFORMANCE=false
NEXT_PUBLIC_FIREBASE_ENABLE_EMULATOR=false

# Emulator Config
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST="http://localhost:9099"

# Admin SDK
FIREBASE_ADMIN_PRIVATE_KEY=<Your Private Key>
FIREBASE_ADMIN_CLIENT_EMAIL=<Your Client Email>
FIREBASE_ADMIN_PROJECT_ID=<Your Project ID>
FIREBASE_AUTH_EMULATOR_HOST=<Your Emulator Host>

# Note: Emulator host should not include http for example: localhost:9099
# Note: If emulator host exits then Firebase Admin SDK will use emulator

```

<p>(Optional) Try to build the frontend (production build) outside of the container. It should be successful without any error.</p>

```
yarn
yarn build
```

<p>Build the frontend image by running (Make sure you are in the <strong>/frontend</strong> folder of the repository):</p>

```
# Note: API_ENDPOINT should be publicly accessible by both client and NextJS server
# For local image, you can omit build args to use localhost:800 as the api endpoint
# Registry tag example (Dockerhub): zuikaru/quizkan-frontend

docker build -t quizkan-frontend --build-arg API_ENDPOINT=<backend-server-api-url> .
docker tag quizkan-frontend <your-registry-tag>
docker push <your-registry-tag>
```

<p>Backend (Make sure you are in /backend folder)<br>
Change the .env as follows:</p>

```
# Basic
HOST=0.0.0.0
PORT=8000

# Firebase
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n <Your Private Key> \n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=<Your Client Email>
FIREBASE_ADMIN_PROJECT_ID=<Your Project ID>
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099

# Mongodb
MONGODB_URI=mongodb://localhost:27017/<Your DB Name>

# Agones
AGONES_ENABLED=false # true during production
```

<p>Build and push the backend image.</p>

```
docker build -t quizkan-backend . 
docker tag quizkan-backend <your-registry-tag>
docker push <your-registry-tag>
```

# Running On Local
<p><strong>Individually</strong></p>
<ul>
<li>Create MongoDB database.</li>
<li>Config both frontend and backend .env in the format of 6.2.1 and 6.2.2.</li>
<li>Start Firebase Emulator. (Make sure your are in <strong>/backend</strong> folder)</li>
<p>Terminal for Firebase Authentication
  
```
firebase emulators:start
```

</p>
<li>(Optional) Start Agones emulator.</li>

```
# Example for Windows
./sdk-server.xxx.amd64.exe --local
```

<li>Make sure to install all dependencies before running the application. (Run yarn)</li>
<li>Install cross-env globally.</li>
<li>In backend, run (Make sure your are in /backend folder)</li>
<p>Terminal for Main Server
  
```
yarn start
# Use yarn start:dev if you want hot reload functionality
```

</p>
<li>In backend, run game server (Make sure your are in <strong>/backend</strong> folder)</li>

```
# Set AGONES=true if you want to test Agones functionality
# Use yarn start:dev if you want hot reload functionality
# Note: The game state is not persisted after reach reload

cross-env MODE=game AGONES=false yarn start
```

<li>In frontend, build service worker file <br>(Relevant issue: GenerateSW has been called multiple times ?? Issue #51 ?? shadowwalker/next-pwa (github.com))</li>
<ul>
<li>In next.config.js: comment the pwa.enable</li>
<li>Run yarn dev</li>
<li>Wait until ???compiled successfully??? appears.</li>
<li>Stop the current yarn dev process.</li>
<li>Uncomment pwa.enable</li>
</ul>
<li>In frontend, run (Make sure your are in /frontend folder)</li>
<p>Terminal for Client

```
yarn dev
```

</p>
<li>Open http://localhost:3000 to see the web app.</li>
</ul>
	
<p><strong>Minikube cluster</strong><p>
<ul>
<li>Build all the required images.</li>
<li>Update image name in deployment.yaml, fleet.yaml, gameserver.yaml both frontend and backend if you use a different container registry.</li>
<li>Make sure MongoDB Server is currently running.</li>
<li>Make sure you are in the root directory of the project.</li>
<li>Make sure to set up the image pull secret correctly if the images are on a private registry.</li>
<li>Make sure to have the Minikube cluster set up and running. In addition, please make sure to install the helm package manager as well.</li>
<li>Install Agones by running</li>

```
helm repo add agones https://agones.dev/chart/stable
helm repo update
helm install agones --namespace agones-system --create-namespace agones/agones
```

<li>(Minikube only) Get minikube cluster ip by running</li>

```
minikube ssh ???grep host.minikube.internal /etc/hosts | cut -f1???
```
<li>Create MongoDB service by running the following command.<br> This will expose MongoDB on the host machine to the Minikube cluster.<br> Please also replace the ip in the Endpoint object by your ip address from the above command.</li>

```
kubectl apply -f mongo/service-local.yaml
```

<li>Create a secret by running the following command.<br> Edit flag can be omitted if the necessary configuration is already in place. <br>For the backend, there are 2 secrets: firebase private key, mongodb uri. <br>For the frontend there is one secret: Firebase private key.</li>

```
# Note: The secret value must be base64 encoded.
kubectl create --edit -f backend/secret.yaml
kubectl create --edit -f frontend/secret.yaml
```

<li>Create a configuration by running the following. Edit the configuration file if necessary.</li>

```
kubectl apply -f backend/config.yaml
```

<li><li>Create a deployment by running</li>

```
kubectl apply -f backend/deployment.yaml
kubectl apply -f frontend/deployment.yaml
```

<li>Expose the deployment by running</li>

```
kubectl expose deployment quizkan-backend-deployment --type=LoadBalancer --port=8000
kubectl expose deployment quizkan-frontend-deployment --type=LoadBalancer --port=3000
```

<li>Create role binding and fleet.</li>

```
kubectl apply -f rolebinding.yaml
kubectl apply -f fleet.yaml
```

<li>(Minikube only) Open another terminal and run the following command. <strong>Please make sure to keep it open.</strong></li>

```
minikube tunnel
```

<li>Verify that the service is up and running by running the following commands:</li>

```
kubectl get services
kubectl get gs
```

<li>(Minikube only) To access the game server inside the cluster from the host, run the following command in another terminal.</li>

```
kubectl port-forward <game-server-pod-name> <external-port>:<container-port>
```

</ul>

# Running on production
<p><strong>Kubernetes</strong></p>
<ul>
<li>Setup kubectl to use the cluster on the cloud. For Google Kubernetes Engine, run the following command. You can also run the following command in the Cloud Shell if you didn???t set up Google Cloud SDK. Make sure to enable the billing account.</li>
	
```
gcloud container clusters get-credentials <cluster-name>
```

<li>Setup MongoDB Atlas (<u>Get Started with Atlas ??? MongoDB Atlas</u>) and retrieve the connection string. We will use this to configure the backend MONGODB_URI.</li>
<li>(Required if you want all functionalities to be up and running) Setup a domain name.</li>
<li>Clone the repository to somewhere and change the current directory to the repository???s.</li>
<li>Follow all the instructions for Minikube <strong> but not the following steps</strong>: 
	<ul>
		<li>Expose the deployment, MongoDB related step, Minikube only step.</li>
		<li> Please adapt the configuration to the production setting if necessary.</li>
		<li> Please also rebuild the image for the production environment since the api endpoint is not the same as the local environment.</li>
	</ul>
</li>
<li>Create a certificate by running the following command. Make sure to change the domain name to your own.</li>

```
kubectl apply -f certificate.yaml
```




<li>(Optional but recommended for Google Cloud) Reserve static ip for the services by running the following commands.</li>

```
gcloud compute addresses create quizkan-backend --global --ip-version IPV4
gcloud compute addresses create quizkan-frontend --global --ip-version IPV4
```

<li>Create the services and ingress controllers by running the following commands.</li>

```
kubectl apply -f service-backend.yaml
kubectl apply -f service-frontend.yaml
```

<li>Wait until the external ip of the services becomes available. We will use this to set up DNS records.</li>
<li>Modify the DNS record by adding A record which points to the frontend and the backend. </li>
<li>Wait until the certificate becomes available.</li>
<li>Open your domain name or the external ip to view the web application.</li>

</ul>
<p><strong>Cloud Run dedicated game server</strong></p>
<ul>
<li>Make sure to follow the Kubernetes instructions.</li>
<li>Push the images to Google Container Registry (Required by Google Cloud Run)</li>
<li>Go to the Google Cloud Run console and create the new service.</li>
<li>Follow on-screen instructions to set-up the game server. <br>Make sure to set up required environment variables, and set the request timeout to the maximum value (3600 seconds). <br>Increase the memory and vCPU if necessary.</li>
<li>After the game server is up and running. Copy the url to use for the game session.<br> Please make sure to signal the server to make it run the desired game. You can do this from the admin tools page on the web application.<br> After the game has finished, please shut down the game server and the server will become available for next session.</li>

</ul>


