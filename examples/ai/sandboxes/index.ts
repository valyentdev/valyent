import { Client } from 'valyent.ts'

const client = new Client(
  process.env.VALYENT_API_KEY!,
  process.env.VALYENT_ORGANIZATION!,
  'http://localhost:3333'
)
const sbx = await client.ai.sandboxes.create('code-interpreter')
console.log(sbx)
const execution = await client.ai.sandboxes.runCode(sbx, 'print("hello, world!)', 'python')
console.log(execution)
console.log(execution.text)
console.log(execution.error)
