# Prerequisite 
Before running our project in any method, the following steps must be done:

Download our project on: https://github.com/zuikaru/quizkan
Or clone our project on main branch using: https://github.com/zuikaru/quizkan.git

Sign up or sign in to Google Cloud and Firebase and create a new project, Firebase Spark plan is enough for our project.

<p>Setup the development environment:</p>
<ol>
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
</ol>

<p>Prepare cloud service configuration</p>
<ol>
<li>MongoDB Atlas credentials</li>
<li>Firebase configuration</li>
<li>Firebase Admin SDK credentials</li>
</ol>
