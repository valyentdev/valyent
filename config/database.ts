import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      debug: true,
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: [
          './app/common/database/migrations',
          './app/organizations/database/migrations',
          './app/api_keys/database/migrations',
          './app/ai/database/migrations',
        ],
      },
      seeders: {
        paths: ['./app/auth/database/seeders', './app/common/database/seeders'],
      },
    },
  },
})

export default dbConfig
