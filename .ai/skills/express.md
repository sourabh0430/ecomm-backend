# Express.js Enterprise Skills

## Task: Implement Secure JWT Auth
1. Generate `accessToken` (15m) and `refreshToken` (7d).
2. Send `refreshToken` in an `HttpOnly` cookie.
3. Create a `/refresh-token` endpoint to rotate tokens.

## Task: Request Validation with Zod
1. Define a schema: `const loginSchema = z.object({ email: z.string().email(), ... })`.
2. Create a middleware `validate(schema)` that checks `req.body`.
3. If validation fails, pass a `ValidationError` to the next handler.

## Task: Implementing Redis Caching
1. Check Redis for the key: `const cachedData = await redis.get(key)`.
2. If exists, return cached data.
3. If not, fetch from DB, save to Redis with TTL, and return.
