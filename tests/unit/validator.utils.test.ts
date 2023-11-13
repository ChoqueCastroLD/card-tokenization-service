import { describe, expect, it } from 'bun:test'

import {
    isNumericString,
    validateCardNumber,
    validateCVV,
    validateExpirationMonth,
    validateExpirationYear,
    validateEmail
} from "../../src/utils/validator.utils"


const cardDetails = {
    cardNumber: '5404136451666690',
    cvv: '509',
    expirationMonth: '11',
    expirationYear: '2028',
    email: 'example@gmail.com'
}

describe('isNumericString', () => {
    it('Should return true if input is numeric', async () => {
        const result = isNumericString('123')
        expect(result).toBe(true)
    })

    it('Should return false if input is not numeric', async () => {
        const result = isNumericString('abc')
        expect(result).toBe(false)
    })

    it('Should return false if input is empty', async () => {
        const result = isNumericString('')
        expect(result).toBe(false)
    })

    it('Should return false if input is mixed', async () => {
        const result = isNumericString('123abc')
        expect(result).toBe(false)
    })
})

describe('validateCardNumber', () => {
    it('Should return true with valid card number', async () => {
        const result = validateCardNumber(cardDetails.cardNumber)
        expect(result).toBe(true)
    })

    it('Should return false with invalid card number', async () => {
        const result = validateCardNumber('1234567890123456')
        expect(result).toBe(false)
    })

    it('Should return false with empty card number', async () => {
        const result = validateCardNumber('')
        expect(result).toBe(false)
    })

    it('Should return false with a card number length less than 13', async () => {
        const result = validateCardNumber('123456789012')
        expect(result).toBe(false)
    })

    it('Should return false with a card number length greater than 19', async () => {
        const result = validateCardNumber('12345678901234567890')
        expect(result).toBe(false)
    })

    it('Should return false with a not numeric input', async () => {
        const result = validateCardNumber("abc")
        expect(result).toBe(false)
    })
})

describe('validateCVV', () => {
    it('Should return true with valid cvv', async () => {
        const result = validateCVV(cardDetails.cvv)
        expect(result).toBe(true)
    })

    it('Should return false with invalid cvv', async () => {
        const result = validateCVV('12345')
        expect(result).toBe(false)
    })

    it('Should return false with empty cvv', async () => {
        const result = validateCVV('')
        expect(result).toBe(false)
    })

    it('Should return false with a cvv length less than 3', async () => {
        const result = validateCVV('12')
        expect(result).toBe(false)
    })

    it('Should return false with a cvv length greater than 4', async () => {
        const result = validateCVV('12345')
        expect(result).toBe(false)
    })

    it('Should return false with a not numeric input', async () => {
        const result = validateCVV("abc")
        expect(result).toBe(false)
    })
})

describe('validateExpirationMonth', () => {
    it('Should return true with valid expiration month', async () => {
        const result = validateExpirationMonth(cardDetails.expirationMonth)
        expect(result).toBe(true)
    })

    it('Should return false with invalid expiration month', async () => {
        const result = validateExpirationMonth('13')
        expect(result).toBe(false)
    })

    it('Should return false with empty expiration month', async () => {
        const result = validateExpirationMonth('')
        expect(result).toBe(false)
    })

    it('Should return false with a expiration month length less than 1', async () => {
        const result = validateExpirationMonth('')
        expect(result).toBe(false)
    })

    it('Should return false with a expiration month length greater than 2', async () => {
        const result = validateExpirationMonth('123')
        expect(result).toBe(false)
    })

    it('Should return false with a not numeric input', async () => {
        const result = validateExpirationMonth("abc")
        expect(result).toBe(false)
    })

    it('Should return false with a expiration month less than 1', async () => {
        const result = validateExpirationMonth("0")
        expect(result).toBe(false)
    })

    it('Should return false with a expiration month greater than 12', async () => {
        const result = validateExpirationMonth("13")
        expect(result).toBe(false)
    })
})

describe('validateExpirationYear', () => {
    it('Should return true with valid expiration year', async () => {
        const result = validateExpirationYear(cardDetails.expirationYear)
        expect(result).toBe(true)
    })

    it('Should return false with invalid expiration year', async () => {
        const result = validateExpirationYear('123')
        expect(result).toBe(false)
    })

    it('Should return false with empty expiration year', async () => {
        const result = validateExpirationYear('')
        expect(result).toBe(false)
    })

    it('Should return false with a expiration year length less than 4', async () => {
        const result = validateExpirationYear('123')
        expect(result).toBe(false)
    })

    it('Should return false with a expiration year length greater than 4', async () => {
        const result = validateExpirationYear('12345')
        expect(result).toBe(false)
    })

    it('Should return false with a not numeric input', async () => {
        const result = validateExpirationYear("abc")
        expect(result).toBe(false)
    })

    it('Should return false with a expiration year less than current year', async () => {
        const currentYear = new Date().getFullYear()
        const result = validateExpirationYear((currentYear - 1).toString())
        expect(result).toBe(false)
    })

    it('Should return false with a expiration year greater than current year + 6', async () => {
        const currentYear = new Date().getFullYear()
        const result = validateExpirationYear((currentYear + 6).toString())
        expect(result).toBe(false)
    })
})

describe('validateEmail', () => {
    it('Should return true with valid email', async () => {
        const result = validateEmail(cardDetails.email)
        expect(result).toBe(true)
    })

    it('Should return true with valid domain email', async () => {
        expect(validateEmail('example@gmail.com')).toBe(true)
        expect(validateEmail('example@hotmail.com')).toBe(true)
        expect(validateEmail('example@yahoo.es')).toBe(true)
    })

    it('Should return false with invalid email', async () => {
        const result = validateEmail('abc')
        expect(result).toBe(false)
    })

    it('Should return false with empty email', async () => {
        const result = validateEmail('')
        expect(result).toBe(false)
    })

    it('Should return false with a email without @', async () => {
        const result = validateEmail('abc.com')
        expect(result).toBe(false)
    })

    it('Should return false with a email without .', async () => {
        const result = validateEmail('abc@gmailcom')
        expect(result).toBe(false)
    })

    it('Should return false with a email without domain', async () => {
        const result = validateEmail('abc@.com')
        expect(result).toBe(false)
    })

    it('Should return false with a email length less than 5', async () => {
        const result = validateEmail('a@a.com')
        expect(result).toBe(false)
    })

    it('Should return false with a email length greater than 100', async () => {
        const result = validateEmail('a'.repeat(255) + '@a.com')
        expect(result).toBe(false)
    })
    
    it('Should return false when email is not in valid email domains', async () => {
        const result = validateEmail('example@invaliddomain.com')
        expect(result).toBe(false)
    })
})
