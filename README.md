# DM Pratas - Jewelry Catalog

Catálogo online de joias com painel administrativo para gerenciar produtos, categorias e imagens. Desenvolvido para uma joalheria real e disponível em produção.

**Deploy:** [dmpratas.sttarnord.com.br](https://dmpratas.sttarnord.com.br/)

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **API:** Next.js API Routes (located at `src/app/api/`)
- **Database:** PostgreSQL 16 (via Docker)
- **ORM:** Prisma 7
- **Image Upload:** Cloudinary
- **Authentication:** JWT

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [Docker](https://www.docker.com/) and Docker Compose
- [Cloudinary](https://cloudinary.com/) account (for image uploads)

## Environment Setup

1. Clone the repository:

```bash
git clone git@github.com:sttarnord/dmpratas.git
cd dmpratas
```

2. Install dependencies:

```bash
npm install
```

3. Create the `.env` file at the project root based on `.env.example`:


4. Fill in the variables in `.env`:

## Starting the Database

PostgreSQL runs via Docker. To start it:

```bash
docker compose up -d
```

## Database Migrations

After starting Docker, run migrations to create the tables:

```bash
npx prisma migrate dev
```

To seed the database with initial data (categories and sample products):

```bash
npm run db:seed
```

Other useful Prisma commands:

```bash
# Apply migrations in production
npx prisma migrate deploy

# Reset the database (drops everything and recreates)
npx prisma migrate reset

# Generate the client after schema changes
npx prisma generate
```

## Running the Project

With the database running and migrations applied:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The admin panel is available at [http://localhost:3000/admin](http://localhost:3000/admin).

## Production Build

```bash
npm run build
npm start
```
