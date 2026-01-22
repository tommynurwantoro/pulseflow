'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { Home, History, Settings, LogOut, Heart } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/history', label: 'History', icon: History },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl">
      <div className="glass-card px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 text-xl font-heading font-bold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent hover:from-blue-600 hover:to-red-600 transition-all duration-200 ease-out cursor-pointer"
            >
              <Heart className="w-6 h-6 text-blue-500" />
              <span>Pulseflow</span>
            </Link>
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out cursor-pointer ${
                      isActive
                        ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-sm text-slate-600 dark:text-slate-400 font-medium">
              {session?.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200 ease-out cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
