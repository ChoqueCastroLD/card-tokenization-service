import jwt from "jsonwebtoken"

import redis from "../services/redis.service"
import { CardDetails, CardDetailsWithoutCVV } from "../types/card.types"
import { validateCVV, validateCardNumber, validateEmail, validateExpirationMonth, validateExpirationYear } from "../utils/validator.utils"
import { BadRequestError } from "../utils/errors.utils"
import { JWT_PRIVATE_KEY, SECONDS_TO_EXPIRE_CARD_TOKEN } from "../utils/constants.utils"


export async function tokenizeCard(cardDetails: CardDetails, authorizationKey: string): Promise<{ token: string }> {
    const { card_number, cvv, expiration_month, expiration_year, email } = cardDetails

    if (!validateCardNumber(card_number))
        throw new BadRequestError("Invalid card number")

    if (!validateCVV(cvv))
        throw new BadRequestError("Invalid CVV")

    if (!validateExpirationMonth(expiration_month))
        throw new BadRequestError("Invalid expiration month")

    if (!validateExpirationYear(expiration_year))
        throw new BadRequestError("Invalid expiration year")

    if (!validateEmail(email))
        throw new BadRequestError("Invalid email")

    const payload = {
        card_number: parseInt(card_number),
        cvv: parseInt(cvv),
        expiration_month,
        expiration_year,
        email
    }

    const token = jwt.sign(payload, JWT_PRIVATE_KEY, {
        expiresIn: SECONDS_TO_EXPIRE_CARD_TOKEN
    })

    const redisKey = `${authorizationKey}:${token}`

    await redis.set(redisKey, JSON.stringify(payload), {
        EX: SECONDS_TO_EXPIRE_CARD_TOKEN
    })

    return { token }
}

export async function getCardFromToken(token: string, authorizationKey: string): Promise<CardDetailsWithoutCVV> {
    try {
        jwt.verify(token, JWT_PRIVATE_KEY)

        const redisKey = `${authorizationKey}:${token}`

        const cardDetailsString = await redis.get(redisKey)

        if (!cardDetailsString)
            throw new BadRequestError("Token not found")

        const cardDetails = JSON.parse(cardDetailsString) as CardDetails

        return {
            card_number: cardDetails.card_number.toString(),
            expiration_month: cardDetails.expiration_month,
            expiration_year: cardDetails.expiration_year,
            email: cardDetails.email
        }
    } catch (error: any) {
        if (error?.name === "TokenExpiredError") {
            throw new BadRequestError("Card token expired")
        }
        throw error
    }
}
