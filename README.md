# devgon

This is a modular and innovative fullstack web application designed as a commercial and profitable project.
Its main goal is to provide a flexible app framework that’s easy to customize and extend,
saving development time and enabling the creation of impressive products repeatedly.

### Frontend (.env)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_DOMAIN=test.site

### Backend (.env & .env.test)
NODE_ENV=dev/test/prod
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/devgon
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
JWT_SECRET_KEY=
- to generate (Powershell):
-join ((1..32 | ForEach-Object { "{0:X2}" -f (Get-Random -Maximum 256) })).ToLower()

### VPS server configuration
- Generate key and put public version to VPS
ssh-keygen -t ed25519 -C "hetzner"
- Create firewall: TCP22, TCP80, TCP443
- Add script and run
nano setup.sh
chmod +x setup.sh
./setup.sh


