import { Client } from 'valyent.ts'
import { config } from 'dotenv'

config()

async function start() {
  const client = new Client(
    process.env.VALYENT_API_KEY!,
    process.env.VALYENT_ORGANIZATION!,
    process.env.VALYENT_ENDPOINT || 'https://console.valyent.cloud'
  )
  const sbx = await client.ai.sandboxes.create('code-interpreter')
  const execution = await client.ai.sandboxes.runCode(sbx, 'print("hello, world!")', 'python')
  console.log(`stdout=${execution.logs.stdout}`)
}
start()
