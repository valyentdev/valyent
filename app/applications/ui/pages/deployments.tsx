import React from 'react'
import ApplicationLayout from '../components/application_layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#common/ui/components/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#common/ui/components/select'
import Input from '#common/ui/components/input'
import { SearchIcon } from 'lucide-react'
import GithubIcon from '../components/github_icon'

export default function DeploymentsPage() {
  const [githubOwner, setGithubOwner] = React.useState('public')

  return (
    <ApplicationLayout breadcrumbs={[{ label: 'Deployments' }]}>
      <CardTitle>Deployments</CardTitle>

      <Card className="mt-4">
        <CardHeader className="">
          <div className="flex items-start justify-between space-x-4">
            <div>
              <CardTitle>Connected GitHub Repository</CardTitle>
              <CardDescription>
                Connecting a GitHub repository allows you to deploy applications directly on commit
                pushs.
              </CardDescription>
            </div>
            <a
              className="btn-secondary"
              href="https://github.com/apps/valyenttest/installations/new"
            >
              <GithubIcon />
              <span>Manage Installation</span>
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 items-center space-x-4 mr-4">
            <Select value={githubOwner} onValueChange={setGithubOwner}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue
                  placeholder={
                    <>
                      <GithubIcon />
                      <span>Select a public repository</span>
                    </>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="public">
                  <p className="flex items-center space-x-2">
                    <GithubIcon />
                    <span className="font-medium">Select a public repository</span>{' '}
                  </p>
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              icon={<SearchIcon className="w-4 h-4" />}
              placeholder="https://github.com/valyentdev/hello-world"
            />
          </div>
        </CardContent>
      </Card>
    </ApplicationLayout>
  )
}
