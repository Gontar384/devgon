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


