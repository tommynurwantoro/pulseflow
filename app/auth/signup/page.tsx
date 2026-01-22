'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUpSchema } from '@/lib/validations/auth'
import { Heart, User, Mail, Lock, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate input
      signUpSchema.parse({ name, email, password })

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create account')
        return
      }

      // Redirect to sign in
      router.push('/auth/signin?registered=true')
    } catch (err: any) {
      if (err.name === 'ZodError') {
        setError(err.errors[0]?.message || 'Validation error')
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4 py-12">
      <div className="w-full max-w-md glass-card p-8 animate-in fade-in duration-500">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
              Pulseflow
            </h1>
          </div>
          <h2 className="text-2xl font-heading font-semibold text-slate-900 dark:text-slate-50">
            Create Your Account
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Start tracking your finances today
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-500/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-xl transition-all duration-200 ease-out">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2.5 text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-all duration-200 ease-out pointer-events-none z-10" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-12 pr-4"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2.5 text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-all duration-200 ease-out pointer-events-none z-10" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-12 pr-4"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2.5 text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-all duration-200 ease-out pointer-events-none z-10" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-12 pr-4"
                placeholder="••••••••"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              Must be at least 6 characters
            </p>
          </div>

          <Button
            type="submit"
            variant="secondary"
            disabled={loading}
            className="w-full h-12 text-base font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link 
              href="/auth/signin" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-all duration-200 ease-out cursor-pointer"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
