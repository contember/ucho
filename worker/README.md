# Worker documentation

This documentation provides an overview of the worker function deployed to Cloudflare Workers for executing server-side
operations. It covers the project structure, development, and deployment process. You can check out
the [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers) for more information.

## Getting started

If you want to use the worker in production, you need to deploy it to Cloudflare Workers. You can deploy the worker
using the Github Actions workflow provided in the `.github/workflows/deploy.yml` file. The workflow will automatically
deploy the worker to Cloudflare Workers when you push changes to the `deploy/prod` branch. Just uncomment the workflow
in the `.github/workflows/deploy.yml` file and push the changes to the `deploy/prod` branch.

## Hono

This worker uses the Hono framework for serverless functions. Hono is a lightweight, modular framework for building
serverless functions with TypeScript. It provides a simple API for handling requests and responses, as well as utilities
for logging, error handling, and more. You can check out the [Hono documentation](https://hono.dev/docs) for more
information.

## Contember client middleware

There is a middleware for the Contember client that provides a higher-level API for interacting with the Contember API.
It handles authentication, error handling, and other common tasks. You can find the middleware in the
`src/middleware/contember-client.ts` file. The middleware is set only for `/contember/*` routes by default. You can
customize the middleware to fit your needs. Check out the [Contember GraphQL Client Documentation
](../client/README.md) for more information.

