import env from '#start/env'

export default class DiscordWebhooksService {
  public static async send(content: string) {
    const discordWebhookUrl = env.get('DISCORD_WEBHOOK_URL')
    if (!discordWebhookUrl) {
      return
    }

    await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
  }
}
