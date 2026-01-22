import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getAllMonthlyRecords } from '@/lib/api/monthly-records'
import { formatMonthYear, calculateTotals } from '@/lib/utils'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function HistoryPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const monthlyRecords = await getAllMonthlyRecords(session.user.id)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-slate-50">History</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
          View and edit your past monthly records
        </p>
      </div>

      {monthlyRecords.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="p-4 bg-blue-100 dark:bg-blue-500/20 rounded-full w-fit mx-auto mb-6">
            <Calendar className="w-16 h-16 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-heading font-semibold text-slate-900 dark:text-slate-50 mb-2">
            No records yet
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Start tracking your finances by adding transactions to your current month.
          </p>
          <Link href="/dashboard" className="cursor-pointer">
            <Button variant="secondary">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {monthlyRecords.map((record) => {
            const totals = calculateTotals(record.transactions)
            const balance = totals.totalIncome - totals.totalExpenses

            return (
              <Link
                key={record.id}
                href={`/month/${record.year}/${record.month}`}
                className="glass-card p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 ease-out cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg group-hover:scale-110 transition-all duration-200 ease-out">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-heading font-semibold text-slate-900 dark:text-slate-50">
                      {formatMonthYear(record.year, record.month)}
                    </h2>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200 ease-out" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Income:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(totals.totalIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Expenses:</span>
                    <span className="font-semibold text-red-500 dark:text-red-400">
                      {formatCurrency(totals.totalExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-3 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">Balance:</span>
                    <span className={`font-heading font-bold text-lg ${
                      balance >= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-500 dark:text-red-400'
                    }`}>
                      {formatCurrency(balance)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                    {record.transactions.length} transactions • {record.assets.length} assets
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
