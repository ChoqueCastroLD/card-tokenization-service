import { Elysia } from 'elysia'

import { router as healthRoutes } from './health.routes'
import { router as tokenRoutes } from './token.routes'


export const router = () => new Elysia()
    .use(healthRoutes())
    .use(tokenRoutes())
