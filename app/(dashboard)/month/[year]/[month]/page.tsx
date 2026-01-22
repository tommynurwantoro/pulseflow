import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getMonthlyRecord } from '@/lib/api/monthly-records'
import { getCategoriesByUser } from '@/lib/api/categories'
import { formatMonthYear, calculateTotals } from '@/lib/utils'
import { MonthlyEditClient } from '@/components/month/MonthlyEditClient'

interface MonthPageProps {
  params: Promise<{
    year: string
    month: string
  }>
}

export default async function MonthPage({ params }: MonthPageProps) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const resolvedParams = await params
  const year = parseInt(resolvedParams.year)
  const month = parseInt(resolvedParams.month)

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    redirect('/dashboard')
  }

  const monthlyRecord = await getMonthlyRecord(session.user.id, year, month)
  
  if (!monthlyRecord) {
    redirect('/dashboard')
  }

  const categories = await getCategoriesByUser(session.user.id)
  const totals = calculateTotals(monthlyRecord.transactions)

  // Convert Decimal objects to numbers for client component serialization
  const serializeTransactions = (transactions: typeof monthlyRecord.transactions) => {
    return transactions.map(t => ({
      ...t,
      amount: typeof t.amount === 'object' && 'toNumber' in t.amount 
        ? t.amount.toNumber() 
        : Number(t.amount),
    }))
  }

  const serializeAssets = (assets: typeof monthlyRecord.assets) => {
    return assets.map(a => ({
      ...a,
      value: typeof a.value === 'object' && 'toNumber' in a.value 
        ? a.value.toNumber() 
        : Number(a.value),
    }))
  }

  // Group transactions by category type
  const incomeTransactions = serializeTransactions(
    monthlyRecord.transactions.filter(t => t.category.type === 'INCOME')
  )
  const fixedExpenses = serializeTransactions(
    monthlyRecord.transactions.filter(t => t.category.type === 'FIXED_EXPENSE')
  )
  const variableExpenses = serializeTransactions(
    monthlyRecord.transactions.filter(t => t.category.type === 'VARIABLE_EXPENSE')
  )
  const additionalExpenses = serializeTransactions(
    monthlyRecord.transactions.filter(t => t.category.type === 'ADDITIONAL_EXPENSE')
  )

  // Serialize monthlyRecord for client (remove Decimal fields)
  const serializedMonthlyRecord = {
    ...monthlyRecord,
    transactions: serializeTransactions(monthlyRecord.transactions),
    assets: serializeAssets(monthlyRecord.assets),
  }

  return (
    <MonthlyEditClient
      monthlyRecord={serializedMonthlyRecord}
      categories={categories}
      year={year}
      month={month}
      incomeTransactions={incomeTransactions}
      fixedExpenses={fixedExpenses}
      variableExpenses={variableExpenses}
      additionalExpenses={additionalExpenses}
      assets={serializeAssets(monthlyRecord.assets)}
      totals={totals}
    />
  )
}
