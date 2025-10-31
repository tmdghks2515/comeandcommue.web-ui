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
    withCredentials([sshUserPrivateKey(
      credentialsId: 'anan-server-ssh',
      keyFileVariable: 'SSH_KEY',
      usernameVariable: 'SSH_USER' // anan
    )]) {
      sh(script: """
        ssh -i "\$SSH_KEY" -o StrictHostKeyChecking=no \$SSH_USER@${DEPLOY_HOST} '
          set -e
          cd ${DEPLOY_DIR}
          export IMAGE_TAG=${IMAGE_TAG}
          set -a; [ -f .env ] && . ./.env; set +a
          docker-compose pull ${SERVICE}
          docker-compose up -d --no-deps ${SERVICE}
        '
      """)
    }
  }
}
  }

  post {
    success { sh 'docker image prune -f || true' }
  }
}