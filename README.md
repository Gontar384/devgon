# devgon

This is a modular and innovative fullstack web application designed as a commercial and profitable project.
Its main goal is to provide a flexible app framework that’s easy to customize and extend,
saving development time and enabling the creation of impressive products repeatedly.

## Environment Variables

### Frontend (.env)
NEXT_PUBLIC_API_URL=

### Backend (.env)
NODE_ENV=
DATABASE_URL=postgresql://postgres:password@localhost:5432/devgon

##After clone:

git checkout dev

/root
npm install
delete package-lock.json

/backend
npm install
npm run prisma:generate
.env
.env.test

/frontend
npm install
.env