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
  const totals = calculateTotals(monthlyRecord.transactions)
  const healthScore = calculateFinancialHealthScore(totals.totalIncome, totals.totalExpenses)
  const suggestions = getFinancialSuggestions({
    totalIncome: totals.totalIncome,
    totalExpenses: totals.totalExpenses,
    totalFixedExpenses: totals.totalFixedExpenses,
    totalVariableExpenses: totals.totalVariableExpenses,
    totalAdditionalExpenses: totals.totalAdditionalExpenses,
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-slate-50">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            Your financial health overview
          </p>
        </div>
        <Link href="/history">
          <Button variant="secondary">
            <TrendingUp className="w-4 h-4 mr-2" />
            View History
          </Button>
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
      <div className="glass-card p-6">
        <h2 className="text-xl font-heading font-semibold text-slate-900 dark:text-slate-50 mb-6">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            href={`/month/${new Date().getFullYear()}/${new Date().getMonth() + 1}`}
            className="cursor-pointer"
          >
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Edit Current Month
            </Button>
          </Link>
          <Link href="/settings" className="cursor-pointer">
            <Button variant="outline">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Manage Categories
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
