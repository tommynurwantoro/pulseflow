'use client'

import { useState, useEffect, Suspense, useActionState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authenticate } from '@/lib/actions/auth'
import { Heart, Mail, Lock, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  )

  return (
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
          Welcome Back
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Sign in to continue tracking your finances
        </p>
      </div>

      {/* Success Message */}
      {searchParams.get('registered') === 'true' && (
        <div className="mb-6 p-4 bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-400 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 rounded-xl transition-all duration-200 ease-out">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Account created successfully! Please sign in.</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-500/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-xl transition-all duration-200 ease-out">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-2.5 text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-all duration-200 ease-out pointer-events-none z-10" />
            <Input
              id="email"
              name="email"
              type="email"
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
              name="password"
              type="password"
              required
              className="pl-12 pr-4"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="secondary"
          disabled={isPending}
          className="w-full h-12 text-base font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </Button>
      </form>

      {/* Sign Up Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link 
            href="/auth/signup" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-all duration-200 ease-out cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4 py-12">
      <Suspense fallback={
        <div className="glass-card p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
        </div>
      }>
        <SignInForm />
      </Suspense>
    </div>
  )
}
