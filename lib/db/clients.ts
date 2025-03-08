import { createClient } from '@clickhouse/client-web'
import { ENV } from '../config/env'

export const clickhouse = createClient({
  host: ENV.clickhouse.host,
  username: ENV.clickhouse.user,
  password: ENV.clickhouse.password,
  database: ENV.clickhouse.database,
  compression: {
    response: true,
    request: true
  }
})
