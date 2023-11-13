import { Elysia, t } from 'elysia'

import { tokenizeCard, getCardFromToken } from '../controllers/token.controller'
import { authMiddleware } from '../utils/auth.utils'


export const router = () => new Elysia()
        .use(authMiddleware())
        .post(
            '/api/tokens',
            ({ body: cardDetails, authorizationKey }) => {
                return tokenizeCard(cardDetails, authorizationKey)
            },
            {
                body: t.Object({
                    card_number: t.String(),
                    cvv: t.String(),
                    expiration_month: t.String(),
                    expiration_year: t.String(),
                    email: t.String()
                }),
                response: t.Object({
                    token: t.String()
                })
            }
        )
        .get(
            '/api/tokens',
            ({ query: { token }, authorizationKey }) => {
                return getCardFromToken(token, authorizationKey)
            },
            {
                query: t.Object({
                    token: t.String()
                }),
                response: t.Object({
                    card_number: t.String(),
                    expiration_month: t.String(),
                    expiration_year: t.String(),
                    email: t.String()
                })
            }
        )
