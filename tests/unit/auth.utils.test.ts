import { describe, expect, it } from 'bun:test'

import { isTokenFormatValid, isAuthorizationTokenValid } from "../../src/utils/auth.utils"


const VALID_AUTHORIZATION_KEY = 'pk_test_LsRBKejzCOEEWOsw'

describe('isTokenFormatValid', () => {
    it('Should return true with valid key', async () => {
        const result = isTokenFormatValid(VALID_AUTHORIZATION_KEY)
        expect(result).toBe(true)
    })

    it('Should return false if key does not start with pk', async () => {
        const result = isTokenFormatValid('xz_test_LsRBKejzCOEEWOs')
        expect(result).toBe(false)
    })

    it('Should return false if key does not have an organization', async () => {
        const result = isTokenFormatValid('pk__LsRBKejzCOEEWOs')
        expect(result).toBe(false)
    })

    it('Should return false if key is not 16 characters long', async () => {
        const result = isTokenFormatValid('pk_test_abc')
        expect(result).toBe(false)
    })

    it('Should return false if key is empty', async () => {
        const result = isTokenFormatValid('')
        expect(result).toBe(false)
    })
})

describe('isAuthorizationTokenValid', () => {
    it('Should return the authorization key if valid', async () => {
        const result = isAuthorizationTokenValid(`Bearer ${VALID_AUTHORIZATION_KEY}`)
        expect(result).toBe(VALID_AUTHORIZATION_KEY)
    })

    it('Should throw an error if no token is provided', async () => {
        expect(() => isAuthorizationTokenValid(null)).toThrow('Unauthorized, token required')
    })

    it('Should throw an error if no token is provided', async () => {
        expect(() => isAuthorizationTokenValid('')).toThrow('Unauthorized, token required')
    })

    it('Should throw an error if token does not start with Bearer', async () => {
        expect(() => isAuthorizationTokenValid('pk_test_LsRBKejzCOEEWOsw')).toThrow('Unauthorized, authorization must be a Bearer token')
    })

    it('Should throw an error if token is not 24 characters long', async () => {
        expect(() => isAuthorizationTokenValid('Bearer short')).toThrow('Unauthorized, token must be 24 characters long')
    })

    it('Should throw an error if token is not valid', async () => {
        expect(() => isAuthorizationTokenValid('Bearer invalid')).toThrow('Unauthorized, token must be 24 characters long')
    })
})
