import * as React from 'react'
import Application from '#applications/database/models/application'
import useSuccessToast from '#common/ui/hooks/use_success_toast'
import useQuery from '#common/ui/hooks/use_query'
import useParams from '#common/ui/hooks/use_params'
import { useForm } from '@inertiajs/react'
import ApplicationLayout from '../components/application_layout'
import Button from '#common/ui/components/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '#common/ui/components/card'
import Input from '#common/ui/components/input'
import { IconCircleMinus, IconCirclePlus } from '@tabler/icons-react'
import Label from '#common/ui/components/label'

interface EnvironmentVariablesProps {
  application: Application
}

const EnvironmentVariables: React.FunctionComponent<EnvironmentVariablesProps> = ({
  application,
}) => {
  const successToast = useSuccessToast()
  const query = useQuery()
  const [showRedeployDialog, setShowRedeployDialog] = React.useState(!!query.showRedeployChoice)
  const params = useParams()

  function formatEnvironmentVariables(
    variables?: Record<string, string>
  ): Array<{ key: string; value: string }> {
    if (!variables || Object.keys(variables).length === 0) {
      return [{ key: '', value: '' }]
    }

    return Object.entries(variables).map(([key, value]) => ({ key, value }))
  }

  const form = useForm({
    environmentVariables: formatEnvironmentVariables(application.environmentVariables),
  })

  function addEnvironmentVariable() {
    form.setData('environmentVariables', [
      ...form.data.environmentVariables,
      { key: '', value: '' },
    ])
  }

  function removeEnvironmentVariable(index: number) {
    const variables = form.data.environmentVariables.filter((_, i) => i !== index)
    form.setData('environmentVariables', variables)
  }

  function saveEnvironmentVariables() {
    form.patch(`/organizations/${params.organizationSlug}/applications/${application.id}/env`, {
      onSuccess: () => successToast(),
    })
  }

  React.useEffect(() => {
    if (query.showRedeployChoice) {
      setShowRedeployDialog(true)
    }
  }, [query.showRedeployChoice])

  return (
    <ApplicationLayout breadcrumbs={[{ label: 'Environment Variables' }]}>
      {/* 
      
      TODO: Implement re-deployment mechanism.

      <RedeployDialog
        project={project}
        application={application}
        open={showRedeployDialog}
        setOpen={setShowRedeployDialog}
      /> 
      
      */}

      <Card>
        <CardHeader>
          <CardTitle>Manage environment variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-1 text-zinc-900">
            <Label className="w-1/2">Key</Label>
            <Label className="w-1/2">Value</Label>
            <span className="w-6" />
          </div>

          <div className="flex flex-col gap-x-8 gap-y-2">
            {form.data.environmentVariables.map(
              (variable, index) =>
                variable && (
                  <div className="flex space-x-4 items-center" key={index}>
                    <Input
                      className="w-full"
                      name={`key--${index}`}
                      placeholder="DATABASE_URI"
                      value={form.data.environmentVariables[index].key}
                      onChange={(e) => {
                        const updatedEnvironmentVariables = [...form.data.environmentVariables]
                        updatedEnvironmentVariables[index].key = e.target.value
                        form.setData('environmentVariables', updatedEnvironmentVariables)
                      }}
                    />
                    <Input
                      className="w-full"
                      name={`value--${index}`}
                      placeholder="postgresql://user:password@host:port/database"
                      value={form.data.environmentVariables[index].value}
                      onChange={(e) => {
                        const updatedEnvironmentVariables = [...form.data.environmentVariables]
                        updatedEnvironmentVariables[index].value = e.target.value
                        form.setData('environmentVariables', updatedEnvironmentVariables)
                      }}
                    />
                    <button
                      className="text-zinc-900 cursor-pointer hover:opacity-75 transition-opacity"
                      type="button"
                      onClick={() => removeEnvironmentVariable(index)}
                    >
                      <IconCircleMinus size={16} />
                    </button>
                  </div>
                )
            )}
          </div>

          <Button
            className="mt-2"
            variant="outline"
            type="button"
            onClick={addEnvironmentVariable}
            icon={<IconCirclePlus size={16} />}
          >
            Add variable
          </Button>
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={saveEnvironmentVariables} loading={form.processing}>
            Save variables
          </Button>
        </CardFooter>
      </Card>
    </ApplicationLayout>
  )
}

export default EnvironmentVariables
