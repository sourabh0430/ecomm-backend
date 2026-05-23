# Phase 1: Foundation & Setup

## Objectives
Establish the foundation of the enterprise e-commerce CRM, including project structure, database connections, containerization, and basic authentication.

## Tasks
1. **Repository Setup:**
   - Initialize Git repository.
   - Setup Node.js (Express/NestJS) backend with TypeScript.
   - Configure ESLint, Prettier, and Husky for pre-commit hooks.

2. **Dockerization:**
   - Create `Dockerfile` for the Node.js application.
   - Create `docker-compose.yml` defining services:
     - Application Server
     - MySQL (Relational Database)
     - MongoDB (Document Database)
     - Redis (ElastiCache alternative for local)
     - Elasticsearch (Search engine)

3. **Database Configuration:**
   - Configure MySQL connection and define core entities (e.g., via Prisma or TypeORM).
   - Configure Mongoose/MongoDB connection for flexible schemas.
   - Implement database seeding scripts for initial admin users in MySQL.

4. **Authentication & Authorization (Security):**
   - Implement JWT-based authentication.
   - Setup Role-Based Access Control (RBAC) middleware for `Admin`, `User`, and `Support` roles.

5. **GraphQL Setup:**
   - Install and configure Apollo Server.
   - Define base schema and resolvers structure.

## Definition of Done
- Application runs fully via `docker-compose up`.
- User can register, login, and receive a JWT.
- RBAC middleware successfully blocks unauthorized access to protected routes.
