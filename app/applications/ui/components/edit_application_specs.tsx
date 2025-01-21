import React from 'react'
import { useForm } from '@inertiajs/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#common/ui/components/card'
import { Label } from '#common/ui/components/label'
import RadioCard from '#common/ui/components/radio_card'
import { Button } from '#common/ui/components/button'
import { Cpu, MemoryStick } from 'lucide-react'
import Application from '#applications/database/models/application'
import useSuccessToast from '#common/ui/hooks/use_success_toast'

const EditApplicationSpecs = ({ application }: { application: Application }) => {
  const [cpuKind, setCpuKind] = React.useState(application.guest.cpu_kind)
  const [vcpus, setVcpus] = React.useState(application.guest.cpus)
  const [memoryMB, setMemoryMB] = React.useState(application.guest.memory_mb)
  const successToast = useSuccessToast()

  const form = useForm({
    cpu_kind: application.guest.cpu_kind,
    cpus: application.guest.cpus,
    memory_mb: application.guest.memory_mb,
    region: application.region,
  })

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

  const handleCpuKindChange = (value: string) => {
    setCpuKind(value)
    // Select the first available vCPU option
    const defaultVcpus = machineConfigs[value][0].vcpus
    setVcpus(defaultVcpus)
    // Select the first available memory option for the selected vCPU
    const defaultMemory = machineConfigs[value][0].memory[0]
    setMemoryMB(defaultMemory)
    // Update form data
    form.setData({
      ...form.data,
      cpu_kind: value,
      cpus: defaultVcpus,
      memory_mb: defaultMemory,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    form.put(`/organizations/${application.organization.slug}/applications/${application.id}`, {
      onSuccess: () => {
        successToast('Application specifications updated successfully!')
      },
    })
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Application Specifications</CardTitle>
          <CardDescription>
            Modify the region, CPU and memory specifications for your application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                onChange={(e) => handleCpuKindChange(e.target.value)}
              >
                <div className="px-3 flex py-1.5 items-center space-x-2 font-mono bg-neutral-50 rounded-t-sm font-medium">
                  <Cpu className="w-4 h-4 text-blue-900" />
                  <span className="font-medium">eco</span>
                </div>
                <div className="px-3 py-1.5 text-neutral-600">Optimized for cost</div>
              </RadioCard>
              <RadioCard
                name="cpuKind"
                value="std"
                checked={cpuKind === 'std'}
                onChange={(e) => handleCpuKindChange(e.target.value)}
              >
                <div className="px-3 flex py-1.5 items-center space-x-2 font-mono bg-neutral-50 rounded-t-sm font-medium">
                  <Cpu className="w-4 h-4 text-blue-900" />
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
                      // Select first available memory option when changing vCPUs
                      const defaultMemory = machineConfigs[cpuKind].find(
                        (config) => config.vcpus === vcpusValue
                      )?.memory[0]
                      setMemoryMB(defaultMemory)
                      form.setData({
                        ...form.data,
                        cpus: vcpusValue,
                        memory_mb: defaultMemory,
                      })
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
                      <MemoryStick className="w-4 h-4 text-blue-900" />
                      <span>{m} MB</span>
                    </div>
                    <div className="px-3 py-1.5 text-neutral-600">Memory</div>
                  </RadioCard>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={form.processing}>
            Update Specifications
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default EditApplicationSpecs
