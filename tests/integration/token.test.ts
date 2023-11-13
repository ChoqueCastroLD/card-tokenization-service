Bun.env.DISABLE_LOGS = 'true'
import { afterAll, describe, expect, it } from 'bun:test'

import redis from "../../src/services/redis.service"
import { app } from "../../src/server"


const BASE_URL = `http://${app.server?.hostname}:${app.server?.port}`
const AUTHORIZATION_KEY = 'pk_test_LsRBKejzCOEEWOsw'
const cardDetails = {
    card_number: '5404136451666690',
    cvv: '509',
    expiration_month: '11',
    expiration_year: '2028',
    email: 'example@gmail.com'
}
let test_token = ''

describe('/api/tokens', () => {
    // --------------------
    // POST /api/tokens
    // --------------------
    it('POST /api/tokens Should return a token', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/api/tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AUTHORIZATION_KEY}`
                },
                body: JSON.stringify(cardDetails)
            })
        )

        const payload: any = await response.json()
        
        expect(response.status).toBe(200)

        expect(payload?.token).toBeDefined()
        expect(payload?.token).toBeString()
        expect(payload?.token.length).toBeGreaterThan(0)

        test_token = payload?.token
    })

    it('POST /api/tokens Should return a 401 when no authorization key is provided', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/api/tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cardDetails)
            })
        )

        expect(response.status).toBe(401)
    })

    it('POST /api/tokens Should return a 401 error when authorization key is invalid', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/api/tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer invalid`
                },
                body: JSON.stringify(cardDetails)
            })
        )

        expect(response.status).toBe(401)
    })

    it('POST /api/tokens Should return a 400 error when body properties are missing', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/api/tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AUTHORIZATION_KEY}`
                },
                body: JSON.stringify({})
            })
        )

        expect(response.status).toBe(400)
    })

    it('POST /api/tokens Should return a 400 error when card number is invalid', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/api/tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AUTHORIZATION_KEY}`
                },
                body: JSON.stringify({
                    ...cardDetails,
                    card_number: '123'
                })
            })
        )

        expect(response.status).toBe(400)
    })

    it('POST /api/tokens Should return a 400 error when cvv is invalid', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/api/tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AUTHORIZATION_KEY}`
                },
                body: JSON.stringify({
                    ...cardDetails,
                    cvv: '12345'
                })
            })
        )

        expect(response.status).toBe(400)
    })

    it('POST /api/tokens Should return a 400 error when expiration month is invalid', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/api/tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AUTHORIZATION_KEY}`
                },
                body: JSON.stringify({
                    ...cardDetails,
                    expiration_month: '13'
                })
            })
        )

        expect(response.status).toBe(400)
    })

    it('POST /api/tokens Should return a 400 error when expiration year is invalid', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/api/tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AUTHORIZATION_KEY}`
                },
                body: JSON.stringify({
                    ...cardDetails,
                    expiration_year: '2015'
                })
            })
        )

        expect(response.status).toBe(400)
    })

    it('POST /api/tokens Should return a 400 error when email is invalid', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/api/tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AUTHORIZATION_KEY}`
                },
                body: JSON.stringify({
                    ...cardDetails,
                    email: 'invalid'
                })
            })
        )

        expect(response.status).toBe(400)
    })

    // --------------------
    // GET /api/tokens
    // --------------------
    it('GET /api/tokens Should match cardDetails from token', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/api/tokens?token=${test_token}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${AUTHORIZATION_KEY}`
                }
            })
        )

        const payload: any = await response.json()
        
        expect(response.status).toBe(200)

        expect(payload?.card_number).toBe(cardDetails.card_number)
        expect(payload?.cvv).toBeUndefined()
        expect(payload?.expiration_month).toBe(cardDetails.expiration_month)
        expect(payload?.expiration_year).toBe(cardDetails.expiration_year)
        expect(payload?.email).toBe(cardDetails.email)
    })

    it('GET /api/tokens Should return a 401 when no authorization key is provided', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/api/tokens?token=${test_token}`, {
                method: 'GET',
            })
        )

        expect(response.status).toBe(401)
    })

    it('GET /api/tokens Should return a 401 error when authorization key is invalid', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/api/tokens`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer invalid`
                },
            })
        )

        expect(response.status).toBe(401)
    })

    it('GET /api/tokens Should return a 400 error when token has invalid signature', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/api/tokens?token=invalid`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${AUTHORIZATION_KEY}`
                }
            })
        )

        expect(response.status).toBe(500)
    })

    it('GET /api/tokens Should return a 400 error when token is expired', async () => {
        const expired_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXJkX251bWJlciI6NTQwNDEzNjQ1MTY2NjY5MCwiY3Z2Ijo1MDksImV4cGlyYXRpb25fbW9udGgiOiIxMSIsImV4cGlyYXRpb25feWVhciI6IjIwMjgiLCJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWF0IjoxNjk5ODI4NTY3LCJleHAiOjE2OTk4Mjg2Mjd9.xn1hAeJH5CaBu3ixaE8QPERqD9Mu-4Njk-VEo0TbKVg'

        const response = await app.handle(
            new Request(`${BASE_URL}/api/tokens?token=${expired_token}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${AUTHORIZATION_KEY}`
                }
            })
        )

        expect(response.status).toBe(400)
    })

    it('GET /api/tokens Should return a 400 error when token is not found', async () => {
        /* This happens when a token is generated with a different authorization key */
        const incorrect_authorization_key = 'pk_test_AAAAAAAAAAAAAAAA'

        const response = await app.handle(
            new Request(`${BASE_URL}/api/tokens?token=${test_token}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${incorrect_authorization_key}`
                }
            })
        )

        expect(response.status).toBe(400)
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
