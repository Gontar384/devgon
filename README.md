# 🔶 devgon

## Code-first CMS framework for building scalable fullstack applications

**devgon is a fullstack framework that lets developers build custom websites and SaaS products where
the frontend structure can be easily mapped into a powerful, configurable CMS.**

You build your UI freely in Next.js.
devgon gives you tools to mirror that UI as structured, editable content in the admin panel — without rewriting everything from scratch.

## 🧠 The Problem

When building custom apps without a CMS:
- every piece of content needs 
  - database models 
  - APIs 
  - admin forms
  - validation
  - permissions

When using traditional CMS platforms:
- you must design data models first
- then force your UI to fit them

**Both approaches are slow and rigid.**

## 🚀 What devgon Solves

devgon introduces a universal content layer between your frontend and backend.

You:
1. Build the frontend the way you want
2. Define what parts should become editable
3. Map them into structured content using devgon’s admin components
This makes it extremely fast to turn:
- static UI → dynamic CMS-driven application
without rewriting backend logic every time.

## 🧩 How devgon Works

**devgon is built around these layers:**

### 1️⃣ Backend — Content Engine
**A NestJS backend that provides:**
- Universal content model
- Media handling (MinIO)
- Business logic
- Validation
- GraphQL + REST
- Strong authorization:
  - OAuth2 (GCP)
  - JWT (access and refresh tokens)
  - HttpOnly Cookies
  - Roles

This backend is not tied to any UI.
It is a generic content engine designed to store any structured data.

### 2️⃣ Frontend
**You build your pages freely in Next.js using any components you want.**

**Admin Panel — Schema Mapping Layer:**
- ready-to-use, easily configurable admin components
- content blocks
- media fields
- relations
- validation rules

**This creates a CMS structure that matches your real UI.**

The result:

**🖥️The admin panel becomes a structured mirror of your frontend.**

### 🔄 Development Flow
- Developer builds the frontend
- Decides what should be editable
- Uses devgon admin components to map that UI into content structures
- Backend stores everything in a unified schema
- Frontend fetches it via GraphQL
- Pages are rendered with ISR
- No duplicated models
- No rewriting APIs
- No rigid CMS constraints

## 🧬 What Makes devgon Different
- Traditional CMS: Model-driven → devgon: UI-driven
- Traditional CMS: Design database first → devgon: Design UI first
- Traditional CMS: UI must adapt to CMS → devgon: CMS adapts to UI
- Traditional CMS: Limited flexibility → devgon: Full control

# ⚡ This Repository

**This repo demonstrates devgon in action.**

Check out the live project here: https://devgon.site

For more information contact: **devgonteam@gmail.com**

## Tech stack
- ✅ Next.js
- ✅ Tailwind + shadcn/ui
- ✅ NestJS
- ✅ PostgreSQL
- ✅ MinIO
- ✅ GraphQL
- ✅ OAuth2 (GCP)
- ✅ Docker
- ✅ CI/CD
- ✅ nginx
- ✅ Deploy on VPS

## Configuration

### /backend
> check .env.example and add .env file
> 
> npm install
> 
> docker compose -f docker-compose.dev.yml up
> 
> npm run dev

### /frontend
> check .env.example and add .env file
> 
> npm install
> 
> npm run dev

**👾 Content editor and an admin panel are only available for authorized user with 'admin' role.**

## License

This project is licensed under a **custom non-commercial license**.  
Use is only permitted with **explicit personal consent from the author**.

See the LICENSE file for details.