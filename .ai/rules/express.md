# Express.js Enterprise Development Rules

## Architecture & Design
- **Controller-Service Layer**: Controllers handle HTTP concerns (params, status codes), Services handle business logic.
- **Dependency Injection**: Pass dependencies (like Prisma or external clients) to services to facilitate testing.
- **Standardized Errors**: Use custom Error classes (e.g., `AppError`, `ValidationError`) and a single global error handler.

## Security Checklist
- **Security Headers**: Use `helmet()` to set secure HTTP headers.
- **CORS Configuration**: Restrict CORS to specific whitelisted domains in production.
- **Rate Limiting**: Implement `express-rate-limit` to prevent Brute Force and DoS attacks.
- **JWT Best Practices**:
    - Use `HttpOnly`, `Secure`, and `SameSite=Strict` cookies for storing tokens.
    - Implement short-lived Access Tokens and long-lived Refresh Tokens.
- **Body Parsing Limits**: Limit JSON body size (e.g., `express.json({ limit: '10kb' })`) to prevent large payload attacks.
- **Validation Layer**: Use `zod` for strict schema validation of `req.body`, `req.params`, and `req.query`.

## Performance & Optimization
- **Response Compression**: Use the `compression` middleware to reduce payload size.
- **Pagination**: Never return all records. Implement mandatory limit/offset or cursor-based pagination for all list endpoints.
- **Caching**: Implement `Redis` for caching frequently accessed, slow-changing data (e.g., Subject lists).
- **Early Exit**: Validate data and permissions as early as possible in the middleware chain.
