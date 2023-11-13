Bun.env.DISABLE_LOGS = 'true'
import { afterAll, describe, expect, it } from 'bun:test'

import redis from "../../src/services/redis.service"
import { app } from "../../src/server"


const BASE_URL = `http://${app.server?.hostname}:${app.server?.port}`

describe('Health Endpoint', () => {
    it('return a response', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/api/health`)
        )
        
        const payload: any = await response.json()
        
        expect(response.status).toBe(200)

        expect(payload?.status).toBe(true)
        expect(payload?.message).toBe('All good 👍')
    })
    afterAll(async () => {
        try {
            await app.stop()
        } catch (error) {
            console.log('Couldnt close server, is it already closed?')
        }
        try {
            await redis.disconnect()
        } catch (error) {
            console.log('Couldnt close redis, is it already closed?')
        }
    })
})
