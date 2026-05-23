# Database & Prisma Enterprise Skills

## Task: Complex Transactions
1. Use `prisma.$transaction(async (tx) => { ... })` for operations that must all succeed or fail together.
2. Ensure business logic inside the transaction is minimal to avoid locking issues.

## Task: Performance Profiling
1. Enable Prisma's `$on('query')` logging in development to see generated SQL.
2. Use `EXPLAIN ANALYZE` in the database console for slow-running Prisma queries.

## Task: Managing Migrations in CI/CD
1. Use `prisma migrate deploy` in the deployment pipeline to apply migrations to production.
2. Never run `prisma migrate dev` in a production environment.
