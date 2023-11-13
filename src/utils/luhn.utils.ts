/**
 * Luhn algorithm in JavaScript: validate credit card number supplied as string of numbers
 * @author ShirtlessKirk. Copyright (c) 2012.
 * @license WTFPL (http://www.wtfpl.net/txt/copying)
 * 
 * Original gist: https://gist.github.com/ShirtlessKirk/2134376
 * Modified by ChoqueCastroLD to add typescript support and be used as a module
 */
export default function luhnCheck(creditCardNumber: string): boolean {
    const digitWeights = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
    let length = creditCardNumber.length
    let isOddPosition = 1
    let sum = 0
    let currentDigit

    while (length) {
        currentDigit = parseInt(creditCardNumber.charAt(--length), 10)
        sum += (isOddPosition ^= 1) ? digitWeights[currentDigit] : currentDigit
    }
    
    return Boolean(sum && (sum % 10 === 0))
}
