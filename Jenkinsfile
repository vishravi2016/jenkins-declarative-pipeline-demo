pipeline {
    agent none

    tools {
        nodejs 'NodeJS-18'
    }

    environment {
        DOCKER_IMAGE='vishravi1975/node-app'
        DOCKER_TAG="${env.BUILD_NUMBER}"
        //APP_ENV = 'development'
    }

    stages {
       
        stage('Checkout') {
            agent any
            steps {
                git branch: 'main', url: 'https://github.com/vishravi2016/jenkins-declarative-pipeline-demo.git'
                stash includes: '**', name: 'source'

            }
        }

        stage('Install Dependencies') {
            agent {
                docker { image: 'node-18-alpine'}
            }
            steps {
                unstash 'source'                
                sh 'npm install'
                stash includes: '**', name: 'after-install'
            }
        }

        stage('Lint') {
            agent {
                docker { image: 'node-18-alpine'}
            }
            steps {
                unstash 'after-install'
                sh 'npm run lint'
            }
        }

        stage('Run Tests') {
            agent {
                docker { image: 'node-18-alpine'}
            }
            steps {
                unstash 'after-install'
                sh 'npm test -- --coverage'
            }
        }

        stage('Build') {
            agent {
                docker { image: 'node-18-alpine'}
            }
            steps {
                unstash 'after-install'
                sh 'npm run build'
                stash includes: '**', name: 'after-build'
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'Image pushed: {DOCKER_IMAGE}:${DOCKER_TAG}'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
        // always {
        //     cleanWs()
        // }
    }
}