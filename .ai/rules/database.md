# Database Enterprise Development Rules

## Schema & Integrity
- **ACID Compliance**: Ensure all related updates are wrapped in `prisma.$transaction`.
- **Naming Convention**: Use `snake_case` for database columns and `PascalCase` for Prisma models.
- **Foreign Keys**: Always define explicit relationships; never rely on application-level "soft" links for critical data.

## Security Checklist
- **Least Privilege**: The database user should only have the permissions required for the application (avoid using `superuser`).
- **SQL Injection**: Use Prisma's parameterization (default) and avoid raw SQL queries (`prisma.$queryRaw`) unless strictly necessary and sanitized.
- **Data Encryption**: Encrypt sensitive fields (like PII) at rest if required by compliance (GDPR/HIPAA).

## Performance & Optimization
- **Indexing Strategy**: Create indexes for all columns used in `WHERE`, `ORDER BY`, and `JOIN` operations. Monitor slow queries.
- **Connection Pooling**: Configure Prisma's connection pool size based on the application's load and server resources.
- **Query Selection**: Use `select` to fetch only the required fields. Avoid `include` for large relations unless necessary.
- **Batching**: Use `createMany` or `updateMany` for bulk operations to reduce database round-trips.
- **Read Replicas**: For high-traffic apps, configure read replicas for scaling read-intensive operations.
