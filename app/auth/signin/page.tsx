'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Heart, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

function SignInForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

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

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-500/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-xl transition-all duration-200 ease-out">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-sm font-medium">
              {error === 'OAuthSignin' && 'Error signing in with Google. Please try again.'}
              {error === 'OAuthCallback' && 'Error processing Google authentication. Please try again.'}
              {error === 'OAuthCreateAccount' && 'Error creating account. Please try again.'}
              {error === 'EmailCreateAccount' && 'Error creating account. Please try again.'}
              {error === 'Callback' && 'Error during authentication. Please try again.'}
              {error === 'OAuthAccountNotLinked' && 'An account with this email already exists. Please sign in with your original method.'}
              {error === 'EmailSignin' && 'Error sending email. Please try again.'}
              {error === 'CredentialsSignin' && 'Invalid credentials. Please try again.'}
              {!['OAuthSignin', 'OAuthCallback', 'OAuthCreateAccount', 'EmailCreateAccount', 'Callback', 'OAuthAccountNotLinked', 'EmailSignin', 'CredentialsSignin'].includes(error) && 'An error occurred. Please try again.'}
            </span>
          </div>
        </div>
      )}

      {/* Google Sign In Button */}
      <Button
        onClick={handleGoogleSignIn}
        variant="secondary"
        className="w-full h-12 text-base font-semibold flex items-center justify-center space-x-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span>Continue with Google</span>
      </Button>
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
