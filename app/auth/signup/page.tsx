'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to signin page since we only use Google OAuth now
    router.replace('/auth/signin')
  }, [router])

  return null
}
