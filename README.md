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
