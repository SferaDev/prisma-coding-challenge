# Prisma Coding Challenge

Author: Alexis Rico

## Environment variables

- `DATABASE_URL`: The database URL to connect to.
- `BASE_URL`: The base URL of the deployment
- `GITHUB_CLIENT_ID`: The GitHub client ID (for authentication)
- `GITHUB_CLIENT_SECRET`: The GitHub client secret (for authentication)
- `SESSION_STORAGE_SECRET`: The session storage secret (for cookie encryption)

## Local development

From your terminal:

```sh
yarn docker:up # OPTIONAL: Start a docker with an empty mysql database
yarn dev
```

## Integration Tests

From your terminal:

```sh
yarn docker:test:up
yarn test
```
