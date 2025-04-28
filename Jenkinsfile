pipeline {
    agent any

    environment {
        VM_USER = 'DuvanVergara'
        VM_HOST = '4.206.177.191'
        VM_CREDENTIALS = 'VM_CREDENTIALS'
        DOCKER_HUB_USERNAME = 'duvanvergara'
        DOCKER_HUB_PASSWORD = 'dckpass'
    }
    stages {
        stage('Test SSH Connection') {
            steps {
                script {
                    def remote = [:]
                    remote.name = 'Azure VM'
                    remote.host = VM_HOST
                    remote.user = VM_USER
                    remote.allowAnyHosts = true
                    remote.credentialsId = VM_CREDENTIALS
                    
                    // Probar la conexión SSH ejecutando un comando simple
                    sshCommand remote: remote, command: 'echo "Connection Successful!"'
                }
            }
        }
        stage('Checkout Repository') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'PipeLine_1_Github', url: 'https://github.com/Duvan-Vergara/Tingeso_Lab_1']])
            }
        }

        // Etapa Backend
        stage('Build and Push Backend') {
            steps {
                script {
                    // Construir y probar backend
                    dir("kartingrm-backend") {
                        bat "mvn clean package"
                        // Crear y empujar imagen Docker de backend
                        bat "docker build -t duvanvergara/kartingrm-backend:latest ."
                    }
                    withCredentials([string(credentialsId: 'dckrhubpassword', variable: 'dckpass')]) {
                        bat "docker login -u duvanvergara -p ${dckpass}"
                    }
                    bat "docker push duvanvergara/kartingrm-backend:latest"
                }
            }
        }

        // Etapa Frontend
        stage('Build and Push Frontend') {
            steps {
                script {
                    // Instalar dependencias y construir el frontend
                    dir("kartingrm-frontend") {
                        bat "npm install"
                        bat "npm run build"
                        // Crear y empujar imagen Docker de frontend
                        bat "docker build -t duvanvergara/kartingrm-frontend:latest ."
                    }
                    withCredentials([string(credentialsId: 'dckrhubpassword', variable: 'dckpass')]) {
                        bat "docker login -u duvanvergara -p ${dckpass}"
                    }
                    bat "docker push duvanvergara/frontend:latest"
                }
            }
        }
    }
}
