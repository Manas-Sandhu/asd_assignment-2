# JWT Authentication System

A REST API built with Node.js, Express, Prisma 7, PostgreSQL, bcrypt, and JWT.

## Requirements

- Node.js 20.19+ (or a compatible newer LTS release)
- PostgreSQL running locally or remotely
- npm

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `DATABASE_URL` with your PostgreSQL username, password, host, port, and database name. Set `JWTSECRET` to a long random secret. Do not commit `.env`.

Create the PostgreSQL database if it does not exist. For example, in `psql`:

```sql
CREATE DATABASE jwt_auth_db;
```

## 3. Create the database tables and generate Prisma Client

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Prisma 7 reads the datasource URL from `prisma.config.ts`. The PostgreSQL driver adapter is configured in `src/config/prisma.js`.

## 4. Run the server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

The API runs at `http://localhost:3000` by default.

## API endpoints

| Method | Endpoint | Authentication |
|---|---|---|
| POST | `/signup` | No |
| POST | `/login` | No |
| GET | `/me` | Bearer token |
| GET | `/dashboard` | Bearer token |

### Sign up

```http
POST /signup
Content-Type: application/json
```

```json
{
  "email": "person@example.com",
  "password": "secret123",
  "name": "Alex"
}
```

### Log in

```http
POST /login
Content-Type: application/json
```

```json
{
  "email": "person@example.com",
  "password": "secret123"
}
```

### Get profile

```http
GET /me
Authorization: Bearer YOUR_JWT
```

### Get dashboard

```http
GET /dashboard
Authorization: Bearer YOUR_JWT
```

## Notes

- Passwords are hashed using bcrypt with 10 salt rounds.
- Emails are trimmed and converted to lowercase before lookup/storage.
- JWTs expire after one hour and include a unique `jti`.
- The JWT payload includes `sub`, `id`, and `email`.
- Password hashes are never included in API responses.
- `.env` is ignored by Git. Submit `.env.example`, not your real `.env`.
