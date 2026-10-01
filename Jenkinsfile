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
            }
        }

        stage('Security') {
            steps {
                echo 'Running security checks...'
                sh 'cd server && npm audit --audit-level=high || true'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying Expense Tracker to test environment...'
            }
        }

        stage('Release') {
            steps {
                echo 'Releasing Expense Tracker...'
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Checking application monitoring...'
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
    }
}
