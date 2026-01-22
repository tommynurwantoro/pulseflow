'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { PulseLoading } from '@/components/shared/PulseLoading'

function SignInForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = () => {
    setLoading(true)
    signIn('google', { callbackUrl: '/dashboard' })
  }

  // Show loading page when user clicks Google sign-in
  if (loading) {
    return <PulseLoading />
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-pulse-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient"></div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-md text-center">
            {/* Animated pulse icon */}
            <div className="mb-8 relative">
              <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100">
                <path
                  className="pulse-line pulse-glow"
                  d="M10,50 L25,50 L30,30 L40,70 L50,20 L60,80 L70,40 L75,50 L90,50"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                />
              </svg>
            </div>
            
            <h1 className="text-5xl font-bold mb-4">Pulseflow</h1>
            <p className="text-xl text-white/80 mb-8">
              Understand your monthly cashflow health at a glance
            </p>
            
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-4">
                <span className="text-2xl">💚</span>
                <span>Track your financial pulse in real-time</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-4">
                <span className="text-2xl">📊</span>
                <span>Visualize cashflow with heartbeat-style graphs</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-4">
                <span className="text-2xl">🎯</span>
                <span>Get personalized financial health insights</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Right side - Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto" viewBox="0 0 100 100">
                <path
                  d="M10,50 L25,50 L30,30 L40,70 L50,20 L60,80 L70,40 L75,50 L90,50"
                  fill="none"
                  stroke="url(#mobile-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="mobile-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              Pulseflow
            </h1>
          </div>

          <div className="glass-card rounded-2xl p-8 shadow-xl border border-slate-200/50 bg-white">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Welcome to Pulseflow</h2>
              <p className="text-slate-500 mt-2">Sign in to track your financial health</p>
            </div>

            {error && (
              <div className="alert alert-error mb-6">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>
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
            )}

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="btn btn-google btn-block py-4 text-base"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-slate-400 text-sm mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Features for mobile */}
          <div className="lg:hidden mt-8 space-y-3">
            <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
              <span className="text-xl">💚</span>
              <span className="text-sm text-slate-600">Track your financial pulse</span>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
              <span className="text-xl">📊</span>
              <span className="text-sm text-slate-600">Heartbeat-style visualization</span>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
              <span className="text-xl">🎯</span>
              <span className="text-sm text-slate-600">Personalized insights</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<PulseLoading />}>
      <SignInForm />
    </Suspense>
  )
}
