import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'

import { router } from './routes/router'
import { loggerPlugin } from "./plugins/logger.plugin"
import { CustomErrorResponse } from './utils/errors.utils'
import { PORT } from './utils/constants.utils'


export const app = new Elysia()
	.onError(({ error, set }) => {
		if (error instanceof CustomErrorResponse) {
			set.status = error.status
			return error.message
		}
	})
	.use(cors())
	.use(swagger())
	.use(loggerPlugin())
	.use(router())
	.listen(PORT)

if (Bun.env?.DISABLE_LOGS !== 'true') {
	console.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
}