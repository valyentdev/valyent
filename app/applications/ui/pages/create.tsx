import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#common/ui/components/card'
import DashboardLayout from '#common/ui/components/dashboard_layout'
import useOrganizations from '#organizations/ui/hooks/use_organizations'
import { Button } from '#common/ui/components/button'
import { Input } from '#common/ui/components/input'
import { Label } from '#common/ui/components/label'
import { useForm } from '@inertiajs/react'
import React from 'react'
import { Cpu, MemoryStick } from 'lucide-react'

export default function () {
  const { currentOrganization } = useOrganizations()

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Applications', href: `/organizations/${currentOrganization?.slug}/applications` },
        { label: 'Create' },
      ]}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <CreateApplicationForm />
      </div>
    </DashboardLayout>
  )
}

const RadioCard = ({ children, checked, onChange, value, name, disabled = false }) => (
  <label className="inline-flex items-center">
    <input
      type="radio"
      className="peer sr-only"
      checked={checked}
      onChange={onChange}
      value={value}
      name={name}
      disabled={disabled}
    />
    <span
      className="divide-y peer-focus:divide-blue-100 peer-checked:divide-blue-100 text-sm border rounded border-neutral-200 bg-white hover:border-neutral-300 
      peer-focus:ring-2 peer-focus:ring-blue-100 w-44
      children:py-3 children:px-3 children:-mx-4 children:border-neutral-100
      first:children:-mt-2 last:children:-mb-2 cursor-pointer
      peer-checked:border-blue-400 peer-checked:hover:border-blue-500 
      peer-checked:children:border-blue-200
      peer-checked:text-blue-700 peer-checked:[&>*_.text-neutral-600]:text-blue-600
      peer-disabled:cursor-not-allowed
      peer-disabled:bg-neutral-50 peer-disabled:peer-checked:bg-blue-50
      peer-checked:peer-disabled:hover:border-blue-400 peer-disabled:hover:border-neutral-200
      peer-disabled:[&>*_.text-neutral-600]:text-neutral-400 
      peer-disabled:text-neutral-400 
      peer-disabled:peer-checked:text-blue-300 
      peer-disabled:peer-checked:[&>*_.text-neutral-600]:text-blue-300"
    >
      {children}
    </span>
  </label>
)

const CreateApplicationForm = () => {
  const { currentOrganization } = useOrganizations()
  const [cpuKind, setCpuKind] = React.useState('')
  const [vcpus, setVcpus] = React.useState(0)
  const [memoryMB, setMemoryMB] = React.useState(0)

  const form = useForm({
    name: '',
    region: '',
    cpu_kind: '',
    cpus: 0,
    memory_mb: 0,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    form.post(`/organizations/${currentOrganization?.slug}/applications`, {
      onSuccess: () => {
        // Handle success
      },
    })
  }

  const machineConfigs = {
    eco: [
      { vcpus: 1, memory: [256, 512, 1024, 2048] },
      { vcpus: 2, memory: [512, 1024, 2048, 4096] },
      { vcpus: 4, memory: [1024, 2048, 4096, 8192] },
      { vcpus: 8, memory: [2048, 4096, 8192, 16384] },
    ],
    std: [
      { vcpus: 1, memory: [1024, 2048, 4096] },
      { vcpus: 2, memory: [2048, 4096, 8192] },
      { vcpus: 4, memory: [4096, 8192, 16384] },
    ],
  }

  const availableVcpus = cpuKind ? machineConfigs[cpuKind].map((config) => config.vcpus) : []
  const availableMemory = cpuKind
    ? machineConfigs[cpuKind].find((config) => config.vcpus === vcpus)?.memory || []
    : []

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center w-full">
      <Card className="max-w-3xl w-full">
        <CardHeader>
          <CardTitle>Create a new application</CardTitle>
          <CardDescription>Specify the application settings to start deploying.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Application Name</Label>
              <Input
                className="mt-1"
                id="name"
                type="text"
                placeholder="Enter application name"
                value={form.data.name}
                onChange={(e) =>
                  form.setData('name', e.target.value.toLowerCase().replaceAll(' ', '-'))
                }
                required
              />
            </div>

            <div className="space-y-1">
              <Label>Region</Label>
              <div className="flex flex-wrap gap-5" role="radiogroup">
                <RadioCard
                  name="region"
                  value="gra-1"
                  checked={form.data.region === 'gra-1'}
                  onChange={(e) => form.setData('region', e.target.value)}
                >
                  <div className="px-3 flex py-1.5 items-center rounded-t-sm space-x-2 bg-neutral-50">
                    <img className="w-4 h-4" src="/ovh.svg" />
                    <span className="font-mono font-medium">gra-1</span>
                  </div>
                  <div className="px-3 py-1.5 text-neutral-600">🇫🇷 France</div>
                </RadioCard>
              </div>
            </div>

            <div className="space-y-1">
              <Label>CPU Kind</Label>
              <div className="flex flex-wrap gap-5" role="radiogroup">
                <RadioCard
                  name="cpuKind"
                  value="eco"
                  checked={cpuKind === 'eco'}
                  onChange={(e) => {
                    setCpuKind(e.target.value)
                    setVcpus(0)
                    setMemoryMB(0)
                    form.setData('cpu_kind', e.target.value)
                  }}
                >
                  <div className="px-3 flex py-1.5 items-center space-x-2 font-mono bg-neutral-50 rounded-t-sm font-medium">
                    <Cpu className="w-4 h-4 text-blue-700" />
                    <span className="font-medium">eco</span>
                  </div>
                  <div className="px-3 py-1.5 text-neutral-600">Optimized for cost</div>
                </RadioCard>
                <RadioCard
                  name="cpuKind"
                  value="std"
                  checked={cpuKind === 'std'}
                  onChange={(e) => {
                    setCpuKind(e.target.value)
                    setVcpus(0)
                    setMemoryMB(0)
                    form.setData('cpu_kind', e.target.value)
                  }}
                >
                  <div className="px-3 flex py-1.5 items-center space-x-2 font-mono bg-neutral-50 rounded-t-sm font-medium">
                    <Cpu className="w-4 h-4 text-blue-700" />
                    <span className="font-medium">Standard</span>
                  </div>
                  <div className="px-3 py-1.5 text-neutral-600">Balanced performance</div>
                </RadioCard>
              </div>
            </div>

            {cpuKind && (
              <div className="space-y-1">
                <Label>VCPUs</Label>
                <div className="flex flex-wrap gap-5" role="radiogroup">
                  {availableVcpus.map((v) => (
                    <RadioCard
                      key={v}
                      name="vcpus"
                      value={v.toString()}
                      checked={vcpus === v}
                      onChange={(e) => {
                        const vcpusValue = parseInt(e.target.value, 10)
                        setVcpus(vcpusValue)
                        setMemoryMB(0)
                        form.setData('cpus', vcpusValue)
                      }}
                    >
                      <div className="px-3 flex py-1.5 items-center space-x-2 font-mono bg-neutral-50 rounded-t-sm font-medium">
                        <span>{v} vCPUs</span>
                      </div>
                      <div className="px-3 py-1.5 text-neutral-600">Cores</div>
                    </RadioCard>
                  ))}
                </div>
              </div>
            )}

            {vcpus > 0 && (
              <div className="space-y-1">
                <Label>Memory</Label>
                <div className="flex flex-wrap gap-5" role="radiogroup">
                  {availableMemory.map((m) => (
                    <RadioCard
                      key={m}
                      name="memory"
                      value={m.toString()}
                      checked={memoryMB === m}
                      onChange={(e) => {
                        const memoryValue = parseInt(e.target.value, 10)
                        setMemoryMB(memoryValue)
                        form.setData('memory_mb', memoryValue)
                      }}
                    >
                      <div className="px-3 flex py-1.5 items-center space-x-2 font-mono bg-neutral-50 rounded-t-sm font-medium">
                        <MemoryStick className="w-4 h-4 text-blue-700" />
                        <span>{m} MB</span>
                      </div>
                      <div className="px-3 py-1.5 text-neutral-600">Memory</div>
                    </RadioCard>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={form.processing}>
            Create Application
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}