# Hospital Total Operation Management System – Backend

This service powers the Hospital Total Operation Management System frontend. It is built with [NestJS](https://nestjs.com/) using [Prisma](https://www.prisma.io/) as the ORM and MySQL as the primary datastore. The architecture is modular and ready for future expansion across hospital operations modules.

## Prerequisites

- Node.js \(>= 18.17\)
- pnpm, npm, or yarn
- MySQL 8.0+

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```
2. Copy the example environment file and adjust values:
   ```bash
   cp .env.example .env
   ```
3. With MySQL running, run Prisma migrations and generate the client:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
4. Seed an initial admin user (optional but recommended):
   ```bash
   pnpm seed
   ```
5. Start the API in watch mode:
   ```bash
   pnpm start:dev
   ```

The API defaults to port `3000` and enables CORS for the Vite dev server at `http://localhost:5173`.

## Key Scripts

- `start` / `start:dev`: Run the NestJS application.
- `prisma:migrate`: Apply and create database migrations during development.
- `prisma:deploy`: Apply migrations in production.
- `seed`: Seed baseline data (creates an active admin account if missing).
- `lint`, `format`, `test`: Project quality tooling.

## Architecture Overview

- `src/app.module.ts` – root module wiring `Auth`, `User`, and shared `Prisma` modules.
- `src/prisma` – globally available Prisma client wrapper.
- `src/auth` – authentication service using JWT and Argon2 password hashing.
- `src/user` – signup and login endpoints exposed at `/user/signup` and `/user/login` for the frontend.
- `prisma/schema.prisma` – source of truth for the database schema.

Incoming users register via `/user/signup`; accounts start in `PENDING` status so administrative workflows can be introduced later. Successful logins return a JWT access token and sanitized user profile. The modular layout allows adding feature domains (patients, appointments, inventory, etc.) as the platform scales.
