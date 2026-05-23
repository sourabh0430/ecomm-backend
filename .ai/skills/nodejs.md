# Node.js Enterprise Skills

## Task: Implement Graceful Shutdown
1. Listen for process signals:
   ```typescript
   process.on('SIGTERM', () => {
     // Close server, DB connections, etc.
   });
   ```
2. Set a timeout to force shutdown if cleaning takes too long.

## Task: Advanced Error Handling
1. Create a `BaseError` class extending `Error`.
2. Create specific errors like `UnauthorizedError(401)`, `ForbiddenError(403)`.
3. Ensure every error has a `statusCode` and an `isOperational` flag.

## Task: Logging with Context
1. Use `logger.info({ userId, requestId }, 'User performed action')`.
2. Ensure request IDs are passed through the service layer for traceability.
