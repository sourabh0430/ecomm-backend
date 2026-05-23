# Node.js Enterprise Development Rules

## Core Principles
- **Strict TypeScript**: Never use `any`. Use interfaces and types for all data structures.
- **Modular Architecture**: Follow the "Vertical Slices" or "Service-Repository" pattern to ensure high cohesion and low coupling.
- **Graceful Shutdown**: Implement handlers for `SIGTERM` and `SIGINT` to close database connections and finish pending requests.
- **Memory Management**: Avoid memory leaks by properly closing streams, clearing intervals, and avoiding large global objects.

## Security Checklist
- **Environment Isolation**: Use `.env.production`, `.env.staging`, and `.env.development`.
- **Dependency Auditing**: Regularly run `npm audit` to check for vulnerable packages.
- **Secrets Management**: Use vault services (like AWS Secrets Manager or HashiCorp Vault) in production instead of plain `.env` files.
- **Input Sanitization**: Always sanitize strings to prevent XSS. Use libraries like `dompurify` if handling HTML.

## Performance & Optimization
- **Cluster Mode**: Utilize all CPU cores using the `cluster` module or a process manager like PM2.
- **Event Loop Monitoring**: Ensure no heavy computations block the event loop. Move CPU-intensive tasks to Worker Threads.
- **Memory Profiling**: Use `--inspect` and Chrome DevTools to profile memory usage under load.
- **Efficient Logging**: Use a high-performance logger like `pino` or `winston`. Avoid `console.log` in production.
