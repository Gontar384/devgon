# devgon

This is a modular and innovative fullstack web application designed as a commercial and profitable project.
Its main goal is to provide a flexible app framework that’s easy to customize and extend,
saving development time and enabling the creation of impressive products repeatedly.

## Environment Variables

### Frontend (.env)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

### Backend (.env)
NODE_ENV=dev/test/prod

FRONTEND_URL=http://localhost:3000

DATABASE_URL=postgresql://postgres:password@localhost:5432/devgon



## After clone:

- git checkout dev

### /root
- npm install
- delete package-lock.json

### /backend
- npm install
- npm run prisma:generate
- npm run prisma:migrate
- .env 
- .env.test

### /frontend
- npm install
- .env

### VPS server configuration

- Generate key and put public version to VPS
ssh-keygen -t ed25519 -C "hetzner"

- Create firewall: TCP22, TCP80, TCP443

- Create 'deploy' user, give permission and create dirs
adduser deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/app
sudo chown -R deploy:deploy /home/deploy/app 
chmod -R u+rwX /home/deploy/app

- Copy ssh to 'deploy' user
mkdir -p /home/deploy/.ssh
cat /root/.ssh/authorized_keys >> /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

- Install docker
sudo apt update
sudo apt install -y docker.io
sudo usermod -aG docker deploy
newgrp docker
docker --version

- Install docker-compose
mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.27.1/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose
docker compose version

- Install postgres (17.5)
curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | sudo tee /usr/share/keyrings/pgdg-keyring.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/pgdg-keyring.gpg] http://apt.postgresql.org/pub/repos/apt noble-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
sudo apt update
sudo apt install postgresql-17
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo -i -u postgres
psql
CREATE DATABASE devgon;
ALTER USER postgres WITH PASSWORD 'password';
\q
psql -U postgres -h localhost -d devgon

- Give permission to db for docker container to connect to
postgres@ubuntu-devgon:/etc/postgresql/17/main$
nano postgresql.conf
listen_addresses = '*'
nano pg_hba.conf
host    all             all             172.18.0.0/16           md5


