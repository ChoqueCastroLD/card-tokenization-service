import { Elysia } from 'elysia'

import { UnauthorizedError } from "../utils/errors.utils"


export function isTokenFormatValid(token: string) {
    const [type, organization, key] = token.split('_')

    if (type !== 'pk') {
        return false
    }

    if (organization.length < 1) {
        return false
    }

    if (key.length !== 16) {
        return false
    }

    return true
}

export function isAuthorizationTokenValid(token: string | null): string {
    if (!token) {
        throw new UnauthorizedError("Unauthorized, token required")
    }
    
    if (!token.startsWith('Bearer ')) {
        throw new UnauthorizedError("Unauthorized, authorization must be a Bearer token")
    }
    
    const authorizationKey = token.split('Bearer ')[1]

    if (authorizationKey.length !== 24) {
        throw new UnauthorizedError("Unauthorized, token must be 24 characters long")
    }

    const isFormatValid = isTokenFormatValid(authorizationKey)

    if (!isFormatValid) {
        throw new UnauthorizedError("Unauthorized, invalid token")
    }

    return authorizationKey
}

export const authMiddleware = () => new Elysia()
    .derive(async ({ request: { headers } }) => {
        const authorizationKey = isAuthorizationTokenValid(headers.get('Authorization'))
        return { authorizationKey }
    })
