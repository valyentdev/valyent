import * as React from 'react'
import AuthLayout from '../components/auth_layout'
import { Link, useForm } from '@inertiajs/react'
import useError from '#common/ui/hooks/use_error'
import InputField from '#common/ui/components/input_field'
import SubmitButton from '#common/ui/components/submit_button'
import Button from '#common/ui/components/button'

interface SignInProps {}

const SignIn: React.FunctionComponent<SignInProps> = () => {
  const form = useForm({
    email: '',
    password: '',
  })
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.post('/auth/sign_in')
  }
  const error = useError('auth')

  const fillDevelopmentValues = () => {
    form.setData({
      email: 'maurice@ravel.fr',
      password: 'maurice@ravel.fr',
    })
  }

  return (
    <AuthLayout
      title="Sign In"
      description={
        <>
          Not Signed Up Yet?{' '}
          <Link
            className="leading-6 text-zinc-900 hover:text-zinc-700 hover:opacity-75 font-medium"
            href="/auth/sign_up"
          >
            Sign Up
          </Link>
        </>
      }
    >
      <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
        <InputField
          id="email"
          type="email"
          label="Email Address"
          placeholder="maurice@ravel.fr"
          value={form.data.email}
          onChange={(e) => form.setData('email', e.target.value)}
        />
        <InputField
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••••"
          value={form.data.password}
          onChange={(e) => form.setData('password', e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <SubmitButton className="!w-full" loading={form.processing}>
          Sign In
        </SubmitButton>
        {process.env.NODE_ENV === 'development' && (
          <Button
            type="button"
            variant="outline"
            className="w-full mt-2"
            onClick={fillDevelopmentValues}
          >
            Fill Development Values
          </Button>
        )}
      </form>
    </AuthLayout>
  )
}

export default SignIn
