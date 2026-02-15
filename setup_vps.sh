#!/bin/bash
set -e

DEPLOY_USER="deploy"
APP_DIR="/home/$DEPLOY_USER/app"
DOCKER_COMPOSE_VERSION="v2.29.1"

echo "=== Creating user '$DEPLOY_USER' and catalogues ==="
sudo adduser --disabled-password --gecos "" $DEPLOY_USER
sudo usermod -aG sudo $DEPLOY_USER
sudo mkdir -p $APP_DIR
sudo chown -R $DEPLOY_USER:$DEPLOY_USER $APP_DIR
sudo chmod -R u+rwX $APP_DIR
echo "$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/$DEPLOY_USER
sudo chmod 440 /etc/sudoers.d/$DEPLOY_USER

echo "=== Copying SSH key from root to '$DEPLOY_USER' ==="
sudo mkdir -p /home/$DEPLOY_USER/.ssh
sudo cp /root/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/authorized_keys
sudo chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
sudo chmod 700 /home/$DEPLOY_USER/.ssh
sudo chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys

echo "=== Docker installation ==="
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin
sudo usermod -aG docker $DEPLOY_USER

echo "=== Docker Compose installation ${DOCKER_COMPOSE_VERSION} ==="
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
sudo chown $DEPLOY_USER:$DEPLOY_USER /usr/local/lib/docker/cli-plugins/docker-compose

echo "=== Configuration finished! ==="
echo "User: $DEPLOY_USER"
echo "App catalogue: $APP_DIR"
echo "PostgreSQL and MinIO will run in Docker containers"
echo ""
echo "IMPORTANT: Add these secrets to your GitHub repository:"
echo "  - VPS_USER"
echo "  - VPS_HOST"
echo "  - VPS_SSH_KEY"
echo "  - JWT_SECRET_KEY"
echo "  - GOOGLE_CLIENT_ID"
echo "  - GOOGLE_CLIENT_SECRET"
echo "  - POSTGRES_PASSWORD"
echo "  - MINIO_PASSWORD"