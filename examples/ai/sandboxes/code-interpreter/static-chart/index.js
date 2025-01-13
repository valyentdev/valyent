import { Client } from 'valyent.ts'
import fs from 'node:fs'
import { config } from 'dotenv'

config()

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
 * Let's define the Python code we want to run inside the sandbox
 * to create a static chart.
 */
const codeToRun = `
import matplotlib.pyplot as plt

plt.plot([1, 2, 3, 4])
plt.ylabel('some numbers')
plt.show()
`

/**
 * Exexcute some Python code.
 */
let execution = await sbx.runCode(codeToRun, 'python')
const firstResult = execution.results[0]

if (firstResult.png) {
  // Save the png to a file. The png is in base64 format.
  fs.writeFileSync('chart.png', firstResult.png, { encoding: 'base64' })
  console.log('Chart saved as chart.png')
}
