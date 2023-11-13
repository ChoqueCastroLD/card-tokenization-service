import luhnCheck from "../utils/luhn.utils"
import { VALID_EMAIL_DOMAINS } from "./constants.utils"


export const isNumericString = (value: string) => /^[0-9]+$/.test(value)

export function validateCardNumber(cardNumber: string): boolean {
    if (!cardNumber)
        return false

    if (cardNumber.length < 13)
        return false

    if (cardNumber.length > 19)
        return false

    if (!isNumericString(cardNumber))
        return false

    return luhnCheck(cardNumber)
}

export function validateCVV(cvv: string): boolean {
    if (!cvv)
        return false

    if (cvv.length < 3)
        return false

    if (cvv.length > 4)
        return false

    if (!isNumericString(cvv))
        return false

    return true
}

export function validateExpirationMonth(month: string): boolean {
    if (!month)
        return false

    if (month.length < 1)
        return false

    if (month.length > 2)
        return false

    if (!isNumericString(month))
        return false

    const monthNumber = Number(month)

    if (monthNumber < 1)
        return false

    if (monthNumber > 12)
        return false

    return true
}

export function validateExpirationYear(year: string): boolean {
    if (!year)
        return false

    if (year.length !== 4)
        return false

    if (!isNumericString(year))
        return false

    const yearNumber = Number(year)

    const currentYear = new Date().getFullYear()
    
    if (yearNumber < currentYear)
        return false

    if (yearNumber > (currentYear + 5))
        return false

    return true
}

export function validateEmail(email: string): boolean {
    if (!email)
        return false

    if (email.length < 5)
        return false

    if (email.length > 100)
        return false

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
        return false

    const domain = email.split("@")[1]

    if (VALID_EMAIL_DOMAINS.indexOf(domain) === -1)
        return false

    return true
}
