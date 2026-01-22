'use client'

import { ArrowUpCircle, ArrowDownCircle, TrendingUp } from 'lucide-react'

interface FinancialSummaryProps {
  totalIncome: number
  totalExpenses: number
  balance: number
}

export function FinancialSummary({ totalIncome, totalExpenses, balance }: FinancialSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Income Card */}
      <div className="glass-card p-6 hover:shadow-2xl hover:scale-[1.02] transition-smooth cursor-pointer group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Total Income</p>
            <p className="text-3xl font-heading font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="ml-4 p-3 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl group-hover:scale-110 transition-smooth">
            <ArrowUpCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="glass-card p-6 hover:shadow-2xl hover:scale-[1.02] transition-smooth cursor-pointer group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Total Expenses</p>
            <p className="text-3xl font-heading font-bold text-red-500 dark:text-red-400">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="ml-4 p-3 bg-red-100 dark:bg-red-500/20 rounded-xl group-hover:scale-110 transition-smooth">
            <ArrowDownCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className={`glass-card p-6 hover:shadow-2xl hover:scale-[1.02] transition-smooth cursor-pointer group ${
        balance >= 0 
          ? 'ring-2 ring-emerald-500/20 dark:ring-emerald-500/30' 
          : 'ring-2 ring-red-500/20 dark:ring-red-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Balance</p>
            <p className={`text-3xl font-heading font-bold ${
              balance >= 0 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-red-500 dark:text-red-400'
            }`}>
              {formatCurrency(balance)}
            </p>
          </div>
          <div className={`ml-4 p-3 rounded-xl group-hover:scale-110 transition-smooth ${
            balance >= 0 
              ? 'bg-emerald-100 dark:bg-emerald-500/20' 
              : 'bg-red-100 dark:bg-red-500/20'
          }`}>
            <TrendingUp className={`w-8 h-8 ${
              balance >= 0 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-red-500 dark:text-red-400'
            }`} />
          </div>
        </div>
      </div>
    </div>
  )
}
