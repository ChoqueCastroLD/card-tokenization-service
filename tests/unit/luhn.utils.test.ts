import { describe, expect, it } from 'bun:test'

import luhnCheck from "../../src/utils/luhn.utils"


const VALID_CARD_NUMBER = '5404136451666690'

describe('luhnCheck', () => {
    it('Should return true with valid card number', async () => {
        const result = luhnCheck(VALID_CARD_NUMBER)
        expect(result).toBe(true)
    })

    it('Should return false with invalid card number', async () => {
        const result = luhnCheck('1234567890123456')
        expect(result).toBe(false)
    })

    it('Should return false with empty card number', async () => {
        const result = luhnCheck('')
        expect(result).toBe(false)
    })

    it('Should return false with a not numeric input', async () => {
        const result = luhnCheck("abc")
        expect(result).toBe(false)
    })
})
