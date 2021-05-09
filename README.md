# Prerequisite 
Before running our project in any method, the following steps must be done:

Download our project on: https://github.com/zuikaru/quizkan
Or clone our project on main branch using: https://github.com/zuikaru/quizkan.git

Sign up or sign in to Google Cloud and Firebase and create a new project, Firebase Spark plan is enough for our project.

Setup the development environment:
  Prepare at least 8GB memory.
    -Docker Desktop, Minikube
    -IDE of your choice: e.g., VSCode
    -NodeJS > 14, yarn package manager
    -MongoDB Community Server
    -Firebase CLI (Firebase CLI reference (google.com))
    -Google Cloud SDK (If you want to use Google Container Registry or use kubectl on your machine)
    -Agones SDK emulator (Local Development | Agones): Although not necessary, it can be useful to debug game server lifecycle.
    -Setup container registry to host the Docker image.
    -Setup image pull secret for Kubernetes. (If hosted on private registry) Pull an Image from a Private Registry | Kubernetes

  Prepare cloud service configuration
    -MongoDB Atlas credentials
    -Firebase configuration
    -Firebase Admin SDK credentials
