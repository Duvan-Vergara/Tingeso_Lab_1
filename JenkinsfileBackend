pipeline{
    agent any
    tools{
        maven "maven"
    }
    stages{
        stage("Build JAR File"){
            steps{
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'PipeLine_1_Github', url: 'https://github.com/Duvan-Vergara/Tingeso_Lab_1']])
                dir("kartingrm-backend"){
                    bat "mvn clean package"
                }
            }
        }
        stage("Test"){
            steps{
                dir("kartingrm-backend"){
                bat 'mvn test'
                }
            }
        }
        stage("Build Docker Image"){
            steps{
                dir("kartingrm-backend"){
                    bat "docker build -t duvanvergara/proyecto_docker ."
                }
            }
        }
        stage("Push Docker Image"){
            steps{
                withCredentials([string(credentialsId: 'dckrhubpassword', variable: 'dckpass')]) {
                    bat "docker login -u duvanvergara -p ${dckpass}"
                }
                bat "docker push duvanvergara/proyecto_docker"
            }
        }
    }
}
