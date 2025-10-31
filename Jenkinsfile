pipeline {
  agent any
  environment {
    REGISTRY    = '192.168.219.113:5000'   // A서버 (private registry)
    DEPLOY_HOST = '192.168.219.145'        // B서버 (실행 서버)
    DEPLOY_DIR  = '/srv/apps/daneyo'
    SERVICE     = 'web'
    IMAGE_TAG   = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    // 로컬 빌드는 건너뛰고, Dockerfile 안에서 npm ci && npm run build 수행
    stage('Docker Build & Push') {
      steps {
        script {
          def image  = "${REGISTRY}/${SERVICE}:${IMAGE_TAG}"
          def latest = "${REGISTRY}/${SERVICE}:latest"
          sh """
            docker build -t ${image} -t ${latest} .
            docker push ${image}
            docker push ${latest}
          """
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
              docker compose -p pull ${SERVICE}
              docker compose -p up -d --no-deps --force-recreate --remove-orphans ${SERVICE}
            '
          """)
        }
      }
    }
  }

  post {
    success { sh 'docker image prune -f' }
  }
}