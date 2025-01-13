import { Client } from 'valyent.ts'

/**
 * Initialize Valyent client.
 */
const client = new Client(
  process.env.VALYENT_API_KEY,
  process.env.VALYENT_ORGANIZATION,
  process.env.VALYENT_ENDPOINT || 'https://console.valyent.cloud'
)

/**
 * Retrieve or create sandbox.
 */
let sbx
if (process.env.VALYENT_SANDBOX_ID) {
  sbx = await client.ai.sandboxes.get(process.env.VALYENT_SANDBOX_ID)
} else {
  sbx = await client.ai.sandboxes.create('code-interpreter')
}

/**
 * Exexcute some Python code.
 */
let execution = await sbx.runCode('print("hello, python!")', 'python')
console.log(`stdout=${execution.logs.stdout}`)

/**
 * Execute some JavaScript code.
 */
execution = await sbx.runCode('console.log("hello, javascript!")', 'javascript')
console.log(`stdout=${execution.logs.stdout}`)
