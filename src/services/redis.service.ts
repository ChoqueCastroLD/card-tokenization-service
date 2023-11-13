import { createClient } from 'redis'

import { REDIS_URL } from '../utils/constants.utils'


const client = await createClient({
    url: REDIS_URL,
})
  .on('error', err => console.error('Redis Client Error', err))
  .connect()

export default client
