pipeline {
  agent any
  environment {
    REGISTRY    = '192.168.219.113:5000'
    DEPLOY_HOST = '192.168.219.145'
    DEPLOY_DIR  = '/srv/apps/myplatform'
    SERVICE     = 'web'
    IMAGE_TAG   = "${env.BUILD_NUMBER}"

    DOCKER_BUILDKIT = '1'
    COMPOSE_DOCKER_CLI_BUILD = '1'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Docker Build & Push') {
      steps {
        script {
          def image  = "${REGISTRY}/${SERVICE}:${IMAGE_TAG}"
          def latest = "${REGISTRY}/${SERVICE}:latest"

          // (권장) Jenkins Credentials 사용
          withCredentials([usernamePassword(credentialsId: 'docker-reg-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh '''
              set -e
              docker login "$REGISTRY" -u "$DOCKER_USER" -p "$DOCKER_PASS"
              docker build --pull -t "$REGISTRY/$SERVICE:$IMAGE_TAG" -t "$REGISTRY/$SERVICE:latest" .
              docker push "$REGISTRY/$SERVICE:$IMAGE_TAG"
              docker push "$REGISTRY/$SERVICE:latest"
            '''
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          ssh -o StrictHostKeyChecking=no "ubuntu@$DEPLOY_HOST" '
            set -e
            cd "$DEPLOY_DIR"
            sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG='"$IMAGE_TAG"'/" .env
            docker compose --env-file .env pull "$SERVICE"
            docker compose --env-file .env up -d --no-deps "$SERVICE"
          '
        '''
      }
    }
  }

  post {
    success { sh 'docker image prune -f || true' }
  }
}