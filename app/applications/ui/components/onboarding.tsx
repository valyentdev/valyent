import Button from '#common/ui/components/button'
import { IconBook } from '@tabler/icons-react'
import * as React from 'react'
import useQuery from '#common/ui/hooks/use_query'
import Confetti from 'react-confetti'
import Step from '#common/ui/components/step'
import Stepper from '#common/ui/components/stepper'
import AddAPIKeyStep from '#api_keys/ui/components/add_api_key_step'
import BillingInformationStep from '#common/ui/components/billing_information_step'

export default function Onboarding() {
  const query = useQuery()
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <div>
      <h1 className="pb-2 order-1 text-2xl sm:text-3xl tracking-tight font-serif text-black">
        Start deploying your applications.
      </h1>
      <h2 className="pb-8 text-sm text-zinc-600 font-normal">
        Follow the steps below to start deploying your applications with Valyent.
      </h2>
      <div>
        {loaded && query.payment_success === 'true' && (
          <div className="absolute inset-0 z-50 pointer-events-none">
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={3000}
            />
          </div>
        )}
        <Stepper>
          <BillingInformationStep />
          <AddAPIKeyStep />
          <Step
            title="Explore and Build"
            description="Dive into our documentation and start building your infrastructure on Ravel."
          >
            <ExploreAndBuildOnboarding />
          </Step>
        </Stepper>
      </div>
    </div>
  )
}

function ExploreAndBuildOnboarding() {
  return (
    <div>
      <div className="mb-4 p-4 bg-purple-50 border border-purple-300 rounded-md flex items-start">
        <IconBook className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-purple-700">
          <p className="font-semibold mb-1">Rich Documentation</p>
          <p>Our comprehensive docs cover everything from basic concepts to advanced features.</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <Button
          variant="purple"
          onClick={() => window.open('https://docs.valyent.cloud', '_blank')}
          icon={<IconBook className="h-4 w-4" />}
        >
          Start Building
        </Button>
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        Get inspired by examples and start creating your infrastructure on Ravel.
      </p>
    </div>
  )
}
