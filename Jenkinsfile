pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                echo 'Building Expense Tracker...'
                sh 'node --version'
                sh 'npm --version'
                sh 'cd server && npm ci'
                sh 'cd client && npm ci'
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated tests...'
                sh 'cd server && npm test'
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Running SonarQube code quality analysis...'

                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {
                        withCredentials([
                            string(
                                credentialsId: 'sonarqube-token',
                                variable: 'SONAR_TOKEN'
                            )
                        ]) {
                            sh "${scannerHome}/bin/sonar-scanner"
                        }
                    }
                }
            }
        }

        stage('Security') {
            steps {
                echo 'Running security checks...'
                sh 'cd server && npm audit --audit-level=high'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying Expense Tracker to test environment...'

                sh '''
                    pkill -f "node index.js" || true

                    cd server
                    nohup node index.js > ../expense-tracker.log 2>&1 &

                    sleep 5

                    curl --fail http://localhost:5001/api/health
                '''
            }
        }

        stage('Release') {
            steps {
                echo 'Creating versioned release...'

                sh '''
                    VERSION="v1.0.${BUILD_NUMBER}"

                    git config user.name "Jenkins"
                    git config user.email "jenkins@localhost"

                    git tag -a "$VERSION" -m "Expense Tracker release $VERSION"

                    echo "Created release: $VERSION"
                '''
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Running application health monitoring...'

                sh '''
                    echo "Checking Expense Tracker health..."

                    curl --fail http://localhost:5001/api/health

                    echo ""
                    echo "Application monitoring check passed."
                '''
            }
        }
    }

    post {
        success {
            echo 'Expense Tracker pipeline completed successfully!'
        }

        failure {
            echo 'Expense Tracker pipeline failed.'
        }

        always {
            sh 'cat expense-tracker.log 2>/dev/null || true'
        }
    }
}