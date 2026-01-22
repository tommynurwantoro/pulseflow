import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date utilities
export function formatMonthYear(year: number, month: number): string {
  const date = new Date(year, month - 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function getCurrentMonthYear(): { year: number; month: number } {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }
}

// Financial calculation utilities
export function calculateFinancialHealthScore(
  totalIncome: number,
  totalExpenses: number
): number {
  if (totalIncome === 0) return 0
  const ratio = (totalIncome - totalExpenses) / totalIncome
  return Math.max(0, Math.min(100, Math.round(ratio * 100)))
}

export function calculateTotals(transactions: Array<{ amount: any; category: { type: string } }>) {
  let totalIncome = 0
  let totalFixedExpenses = 0
  let totalVariableExpenses = 0
  let totalAdditionalExpenses = 0

  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount)
    const categoryType = transaction.category.type

    if (categoryType === 'INCOME') {
      totalIncome += amount
    } else if (categoryType === 'FIXED_EXPENSE') {
      totalFixedExpenses += amount
    } else if (categoryType === 'VARIABLE_EXPENSE') {
      totalVariableExpenses += amount
    } else if (categoryType === 'ADDITIONAL_EXPENSE') {
      totalAdditionalExpenses += amount
    }
  })

  const totalExpenses = totalFixedExpenses + totalVariableExpenses + totalAdditionalExpenses

  return {
    totalIncome,
    totalExpenses,
    totalFixedExpenses,
    totalVariableExpenses,
    totalAdditionalExpenses,
  }
}
