'use client'

import { cn } from '@/lib/utils'

interface CategoryTotal {
  label: string
  amount: number
  color: string
}

interface SummaryPanelProps {
  income: number
  totalExpenses: number
  categoryTotals: CategoryTotal[]
  balance: number
}

export function SummaryPanel({
  income,
  totalExpenses,
  categoryTotals,
  balance,
}: SummaryPanelProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* Total per category */}
      <div className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-sm overflow-hidden">
        <div className="bg-slate-900 dark:bg-slate-950 px-3 py-2">
          <span className="font-semibold text-sm text-white">Total per category</span>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-600">
          {categoryTotals.map((cat, index) => (
            <div 
              key={index}
              className={cn('flex justify-between items-center px-3 py-2', cat.color)}
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{cat.label}</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                IDR{formatCurrency(cat.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary totals */}
      <div className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-sm overflow-hidden">
        <div className="divide-y divide-slate-200 dark:divide-slate-600">
          {/* Income */}
          <div className="flex justify-between items-center px-3 py-2 bg-green-100 dark:bg-green-900/30">
            <span className="text-sm font-semibold text-green-800 dark:text-green-300">Pemasukan</span>
            <span className="text-sm font-bold text-green-700 dark:text-green-400">
              IDR{formatCurrency(income)}
            </span>
          </div>

          {/* Total Expenses */}
          <div className="flex justify-between items-center px-3 py-2 bg-orange-100 dark:bg-orange-900/30">
            <span className="text-sm font-semibold text-orange-800 dark:text-orange-300">Total Pengeluaran</span>
            <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
              IDR{formatCurrency(totalExpenses)}
            </span>
          </div>

          {/* Balance */}
          <div className={cn(
            'flex justify-between items-center px-3 py-2',
            balance >= 0 
              ? 'bg-emerald-100 dark:bg-emerald-900/30' 
              : 'bg-red-100 dark:bg-red-900/30'
          )}>
            <span className={cn(
              'text-sm font-semibold',
              balance >= 0 
                ? 'text-emerald-800 dark:text-emerald-300' 
                : 'text-red-800 dark:text-red-300'
            )}>
              Balance/Invest
            </span>
            <span className={cn(
              'text-sm font-bold',
              balance >= 0 
                ? 'text-emerald-700 dark:text-emerald-400' 
                : 'text-red-700 dark:text-red-400'
            )}>
              IDR{formatCurrency(balance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
