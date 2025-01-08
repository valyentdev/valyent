import emitter from '@adonisjs/core/services/emitter'
import DeploymentSuccessfulBuild from './events/deployment_successful_build.js'

const DeploymentSuccessfulBuildListener = () =>
  import('./listeners/deployment_successful_build_listener.js')

emitter.on(DeploymentSuccessfulBuild, [DeploymentSuccessfulBuildListener])
