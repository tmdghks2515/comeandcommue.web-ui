pipeline {
  agent any
  environment {
    REGISTRY    = '192.168.219.113:5000'   // A서버 (private registry)
    DEPLOY_HOST = '192.168.219.145'        // B서버 (실행 서버)
    DEPLOY_DIR  = '/srv/apps/myplatform'
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
        sh """
          ssh -o StrictHostKeyChecking=no ubuntu@${DEPLOY_HOST} '
            set -e
            cd ${DEPLOY_DIR}
            # 새 태그로 교체
            sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=${IMAGE_TAG}/" .env
            # web 서비스만 롤링
            docker compose --env-file .env pull ${SERVICE}
            docker compose --env-file .env up -d --no-deps ${SERVICE}
          '
        """
      }
    }
  }

  post {
    success { sh 'docker image prune -f' }
  }
}