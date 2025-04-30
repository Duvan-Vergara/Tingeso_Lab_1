pipeline {
    agent any
    stages {
        stage('Checkout Repository') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/Duvan-Vergara/Tingeso_Lab_1']])
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
                    bat "docker push duvanvergara/kartingrm-frontend:latest"
                }
            }
        }
    }
}