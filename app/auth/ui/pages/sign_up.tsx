import * as React from 'react'
import AuthLayout from '../components/auth_layout'
import { Link, useForm } from '@inertiajs/react'
import useError from '#common/ui/hooks/use_error'
import InputField from '#common/ui/components/input_field'
import SubmitButton from '#common/ui/components/submit_button'
import ContinueWithGithub from '../components/continue_with_github'

interface SignUpProps {}

const SignUp: React.FunctionComponent<SignUpProps> = () => {
  const form = useForm({
    fullName: '',
    email: '',
    password: '',
  })
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.post('/auth/sign_up')
  }
  const error = useError('auth.error')
  return (
    <AuthLayout
      title="Create an account"
      action={
        <>
          Already Signed Up?{' '}
          <Link
            className="leading-6 text-zinc-900 hover:text-zinc-700 hover:opacity-75 font-medium"
            href="/auth/sign_in"
          >
            Sign In
          </Link>
        </>
      }
    >
      <ContinueWithGithub />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="fullName"
          type="text"
          label="Full Name"
          placeholder="Maurice Ravel"
          value={form.data.fullName}
          onChange={(e) => form.setData('fullName', e.target.value)}
        />
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
        {error && <p className="text-red-400/80 text-sm">{error}</p>}
        <SubmitButton className="!w-full" loading={form.processing}>
          Sign Up
        </SubmitButton>
      </form>
    </AuthLayout>
  )
}

export default SignUp
