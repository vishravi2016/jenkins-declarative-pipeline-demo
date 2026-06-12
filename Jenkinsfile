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
        
    }

    // post {
    //     success {
    //         echo "Image pushed: ${DOCKER_IMAGE}:${DOCKER_TAG}"
    //     }
    //     failure {
    //         echo 'Pipeline failed. Check logs above.'
    //     }
    // }
}