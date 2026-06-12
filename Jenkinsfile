pipeline {
    agent none

    environment {
        DOCKER_IMAGE = 'yourdockerhubuser/node-app'
        DOCKER_TAG   = "${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            agent any
            steps {
                git branch: 'main', 
                    url: 'https://github.com/vishravi2016/jenkins-declarative-pipeline-demo.git'
                stash includes: '**', name: 'source'
            }
        }

        stage('Install Dependencies') {
            agent {
                docker { image 'node:18-alpine' }
            }
            steps {
                unstash 'source'
                sh 'npm install'
                stash includes: '**', name: 'after-install'
            }
        }

        stage('Lint') {
            agent {
                docker { image 'node:18-alpine' }
            }
            steps {
                unstash 'after-install'
                sh 'npm run lint'
            }
        }

        stage('Run Tests') {
            agent {
                docker { image 'node:18-alpine' }
            }
            steps {
                unstash 'after-install'
                sh 'npm test -- --coverage'
            }
        }

        stage('Build') {
            agent {
                docker { image 'node:18-alpine' }
            }
            steps {
                unstash 'after-install'
                sh 'npm run build'
                stash includes: '**', name: 'after-build'
            }
        }

        stage('Docker Build') {
            agent any
            steps {
                unstash 'after-build'
                script {
                    dockerImage = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Docker Push') {
            agent any
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        dockerImage.push("${DOCKER_TAG}")
                        dockerImage.push('latest')
                    }
                }
            }
        }

        stage('Cleanup Local Images') {
            agent any
            steps {
                sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
                sh "docker rmi ${DOCKER_IMAGE}:latest || true"
            }
        }
    }

    post {
        success {
            echo "Image pushed: ${DOCKER_IMAGE}:${DOCKER_TAG}"
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
    }
}