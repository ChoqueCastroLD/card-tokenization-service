export type CardDetailsWithoutCVV = {
    card_number: string
    expiration_month: string
    expiration_year: string
    email: string
}

export type CardDetails = {
    card_number: string
    cvv: string
    expiration_month: string
    expiration_year: string
    email: string
}
