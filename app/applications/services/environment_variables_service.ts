import { type Request } from '@adonisjs/core/http'

export default class EnvironmentVariablesService {
  public parseEnvironmentVariablesFromRequest(request: Request): Record<string, string> {
    const requestBody = request.body()

    const env: Record<string, string> = {}

    for (const environmentVariable of requestBody.env) {
      if (!environmentVariable || !environmentVariable.key || !environmentVariable.value) {
        continue
      }

      env[environmentVariable.key] = environmentVariable.value
    }

    return env
  }

  haveEnvironmentVariablesChanged(
    oldEnvironmentVariables: Record<string, string>,
    newEnvironmentVariables: Record<string, string>
  ): boolean {
    const oldKeys = Object.keys(oldEnvironmentVariables)
    const newKeys = Object.keys(newEnvironmentVariables)

    if (oldKeys.length !== newKeys.length) {
      return true
    }

    for (const key of oldKeys) {
      if (oldEnvironmentVariables[key] !== newEnvironmentVariables[key]) {
        return true
      }
    }

    return false
  }
}
