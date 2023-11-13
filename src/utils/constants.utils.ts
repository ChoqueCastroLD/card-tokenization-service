export const PORT = Bun.env.PORT ? parseInt(Bun.env.PORT) : 3000

export const REDIS_URL = Bun.env.REDIS_URL ?? 'redis://redis:6379'

export const JWT_PRIVATE_KEY = Bun.env.JWT_PRIVATE_KEY ?? "TOKENIZATION_SECRET"

export const SECONDS_TO_EXPIRE_CARD_TOKEN = Bun.env.SECONDS_TO_EXPIRE_CARD_TOKEN ? parseInt(Bun.env.SECONDS_TO_EXPIRE_CARD_TOKEN) : 60

export const VALID_EMAIL_DOMAINS = ["gmail.com", "hotmail.com", "yahoo.es"]
