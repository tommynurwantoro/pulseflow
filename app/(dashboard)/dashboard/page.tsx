import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getOrCreateCurrentMonthlyRecord } from '@/lib/api/monthly-records'
import { calculateTotals, calculateFinancialHealthScore } from '@/lib/utils'
import { getFinancialSuggestions } from '@/lib/suggestions'
import { HeartbeatVisualization } from '@/components/dashboard/HeartbeatVisualization'
import { FinancialSummary } from '@/components/dashboard/FinancialSummary'
import { SuggestionsCard } from '@/components/dashboard/SuggestionsCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, Settings as SettingsIcon, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const monthlyRecord = await getOrCreateCurrentMonthlyRecord(session.user.id)
  const totals = calculateTotals(monthlyRecord?.transactions || [])
  const healthScore = calculateFinancialHealthScore(totals.totalIncome, totals.totalExpenses)
  const suggestions = getFinancialSuggestions({
    totalIncome: totals.totalIncome,
    totalExpenses: totals.totalExpenses,
    totalFixedExpenses: totals.totalFixedExpenses,
    totalVariableExpenses: totals.totalVariableExpenses,
    totalAdditionalExpenses: totals.totalAdditionalExpenses,
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pulse-gradient flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h4l2-6 4 12 2-6h4" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Pulseflow
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {session?.user && (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-700">{session.user.name || 'User'}</p>
                    <p className="text-xs text-slate-500">{session.user.email}</p>
                  </div>
                  {session.user.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || 'User'}
                      className="w-10 h-10 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {(session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8 page-enter">
          {/* Month header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
              </h2>
              <p className="text-slate-500">Your financial pulse at a glance</p>
            </div>
            <Link href="/history">
              <button className="btn btn-outline btn-sm">
                View History
              </button>
            </Link>
          </div>

          {/* Heartbeat Visualization */}
          <div className="flex justify-center py-8">
            <HeartbeatVisualization score={healthScore} size="lg" />
          </div>

          {/* Financial Summary Cards */}
          <FinancialSummary
            totalIncome={totals.totalIncome}
            totalExpenses={totals.totalExpenses}
            balance={totals.totalIncome - totals.totalExpenses}
          />

          {/* Suggestions Card */}
          <SuggestionsCard suggestions={suggestions} />

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-700 mb-6">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link 
                href={`/month/${new Date().getFullYear()}/${new Date().getMonth() + 1}`}
                className="cursor-pointer"
              >
                <button className="btn btn-outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Edit Current Month
                </button>
              </Link>
              <Link href="/settings" className="cursor-pointer">
                <button className="btn btn-outline">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Manage Categories
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
