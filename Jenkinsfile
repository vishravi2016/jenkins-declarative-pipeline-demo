pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS='dockerhub-credentials'
        DOCKER_IMAGE = 'vishravi1975/node-express-app'
        IMAGE_TAG   = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            agent any
            steps {
                git branch: 'main', 
                    url: 'https://github.com/vishravi2016/jenkins-declarative-pipeline-demo.git'

                //stash includes: '**', name: 'source'
            }
        }
        stage('check environment'){
            steps {
                sh '''
                    whoami
                    pwd
                    node -v
                    npm -v
                '''
            }
        }

        stage('Install Dependencies') {
                
            steps {
                //unstash 'source'
                sh 'npm install'
                //stash includes: '**', name: 'after-install'
            }
        }


        stage('Lint') {
           
            steps {
                //unstash 'after-install'
                sh 'npm run lint'
            }
        }

        stage('Run Tests') {
            
            steps {
                //unstash 'after-install'
                sh 'npm test -- --coverage'
            }
        }
        stage('Build docker image'){
            steps{
                sh """
                    docker build -t ${DOCKER_IMAGE}:${IMAGE_NAME} .
                    docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest

                """
            }
        }

        stage('login to docker hub'){
            steps{
                withCredentials(
                    [
                        usernamePassword(
                            credentialsId: "${DOCKERHUB_CREDENTIALS}",
                            usernameVariable: 'DOCKER_USERNAME',
                            passwordVariable: 'DOCKER_PASSWORD'
                        )
                    ]
                ){
                    sh """
                        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password=stdin
                    """
                }
            }
        }

        stage('push docker image'){
            steps {
                sh """
                    docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                    docker push ${DOCKER_IMAGE}:latest

                """
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
        always {
            sh 'docker logout || true'
        }
    }
}