import env from '#start/env'
import { defineConfig, services } from '@adonisjs/drive'

const driveConfig = defineConfig({
  default: 's3',

  /**
   * The services object can be used to configure multiple file system
   * services each using the same or a different driver.
   */
  services: {
    s3: services.s3({
      credentials: {
        accessKeyId: env.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: env.get('S3_SECRET_ACCESS_KEY'),
      },
      region: env.get('S3_REGION'),
      bucket: env.get('S3_BUCKET'),
      visibility: 'private',
      endpoint: env.get('S3_ENDPOINT'),
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
