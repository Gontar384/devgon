# devgon

This is a modular and innovative fullstack web application designed as a commercial and profitable project.
Its main goal is to provide a flexible app framework that’s easy to customize and extend,
saving development time and enabling the creation of impressive products repeatedly. 
Including custom CMS, external storage, OAuth2 integration and more. With the potential for extensive expansion.

### /devgon/frontend & /devgon/backend
> npm install

### /devgon
> npm install
> 
> npm run dev

### /frontend/.env [EXAMPLE]
> NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
>
> NEXT_PUBLIC_DOMAIN=test.site

### /backend/.env & /backend/.env.test [EXAMPLE]
> NODE_ENV=development/testing/production
>
> FRONTEND_URL=http://localhost:3000
>
> BACKEND_URL=http://localhost:4000
>
> DATABASE_URL=postgresql://postgres:password@localhost:5432/devgon
>
> JWT_SECRET_KEY=
> generate e.g. in Powershell ->
> -join ((1..32 | ForEach-Object { "{0:X2}" -f (Get-Random -Maximum 256) })).ToLower()
>
> GOOGLE_CLIENT_ID=
>
> GOOGLE_CLIENT_SECRET=
>
> COOKIE_DOMAIN=.test.site

## VPS server configuration
### - Generate key and put public version to VPS
> ssh-keygen -t ed25519 -C "hetzner"
### - Firewall: TCP22, TCP80, TCP443
### - Add script and run
> nano setup.sh
>
> chmod +x setup.sh
> 
> ./setup.sh


