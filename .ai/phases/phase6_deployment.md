# Phase 6: CI/CD, AWS Deployment & Scaling

## Objectives
Prepare the application for production, automate testing/deployment, and deploy to AWS.

## Tasks
1. **CI/CD Pipeline:**
   - Create GitHub Actions (or GitLab CI) workflow.
   - **Continuous Integration:** Run ESLint, Type checking, and Jest unit tests on every PR.
   - **Continuous Deployment:** Build Docker images and push to a container registry (Docker Hub or AWS ECR) upon merge to `main`.

2. **AWS Infrastructure (Free Tier / Low Cost):**
   - **Database:** Migrate from local MongoDB to MongoDB Atlas (Free Tier).
   - **Compute:** Deploy application containers to AWS ECS (Fargate) or a free-tier EC2 instance using Docker Compose.
   - **Storage:** Configure AWS S3 bucket for product image uploads.
   - **Caching:** Configure AWS ElastiCache (Redis) or use a managed Redis free tier (e.g., Redis Cloud).

3. **Performance & Security Tuning:**
   - Implement production-grade logging (Winston + CloudWatch).
   - Enforce HTTPS and secure headers (Helmet).
   - Load testing and query optimization.

## Definition of Done
- Pushing to `main` automatically deploys the application to AWS.
- The application is securely accessible via a public URL.
- Media assets are served from an S3 bucket.
