'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { formatMonthYear } from '@/lib/utils'
import { ExpenseSpreadsheet } from './ExpenseSpreadsheet'
import { IncomeSpreadsheet } from './IncomeSpreadsheet'
import { AssetSpreadsheet } from './AssetSpreadsheet'
import { SummaryPanel } from './SummaryPanel'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Loader2, Copy } from 'lucide-react'
import Link from 'next/link'
import { useAlert } from '@/components/ui/alert-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface Transaction {
  id: string
  amount: any
  description: string | null
  date: Date | string
  category: {
    id: string
    name: string
    type: string
  }
}

interface Asset {
  id: string
  name: string
  value: any
  description: string | null
}

interface Category {
  id: string
  name: string
  type: string
}

interface PendingChange {
  id: string
  field: 'amount' | 'description' | 'categoryId'
  value: string | number
}

interface NewTransactionRow {
  tempId: string
  categoryId: string
  amount: number
  description: string
}

interface PendingAssetChange {
  id: string
  field: 'name' | 'value' | 'description'
  value: string | number
}

interface NewAssetRow {
  tempId: string
  name: string
  value: number
  description: string
}

interface MonthlyEditClientProps {
  monthlyRecord: any
  categories: Category[]
  year: number
  month: number
  incomeTransactions: Transaction[]
  fixedExpenses: Transaction[]
  variableExpenses: Transaction[]
  additionalExpenses: Transaction[]
  assets: Asset[]
  totals: {
    totalIncome: number
    totalExpenses: number
    totalFixedExpenses: number
    totalVariableExpenses: number
    totalAdditionalExpenses: number
  }
}

export function MonthlyEditClient({
  monthlyRecord,
  categories,
  year,
  month,
  incomeTransactions,
  fixedExpenses,
  variableExpenses,
  additionalExpenses,
  assets,
  totals,
}: MonthlyEditClientProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isCloning, setIsCloning] = useState(false)
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false)
  const [cloneYear, setCloneYear] = useState(String(year))
  const [cloneMonth, setCloneMonth] = useState(String(month === 12 ? 1 : month + 1))
  const { alert, AlertToast } = useAlert()

  // State for pending changes - Income
  const [incomePendingChanges, setIncomePendingChanges] = useState<PendingChange[]>([])
  const [incomeNewRows, setIncomeNewRows] = useState<NewTransactionRow[]>([])
  const [incomeDeletedIds, setIncomeDeletedIds] = useState<string[]>([])

  // State for pending changes - Fixed Expenses
  const [fixedPendingChanges, setFixedPendingChanges] = useState<PendingChange[]>([])
  const [fixedNewRows, setFixedNewRows] = useState<NewTransactionRow[]>([])
  const [fixedDeletedIds, setFixedDeletedIds] = useState<string[]>([])

  // State for pending changes - Variable Expenses
  const [variablePendingChanges, setVariablePendingChanges] = useState<PendingChange[]>([])
  const [variableNewRows, setVariableNewRows] = useState<NewTransactionRow[]>([])
  const [variableDeletedIds, setVariableDeletedIds] = useState<string[]>([])

  // State for pending changes - Additional Expenses
  const [additionalPendingChanges, setAdditionalPendingChanges] = useState<PendingChange[]>([])
  const [additionalNewRows, setAdditionalNewRows] = useState<NewTransactionRow[]>([])
  const [additionalDeletedIds, setAdditionalDeletedIds] = useState<string[]>([])

  // State for pending changes - Assets
  const [assetPendingChanges, setAssetPendingChanges] = useState<PendingAssetChange[]>([])
  const [assetNewRows, setAssetNewRows] = useState<NewAssetRow[]>([])
  const [assetDeletedIds, setAssetDeletedIds] = useState<string[]>([])

  // Filter categories by type
  const incomeCategories = categories.filter(c => c.type === 'INCOME')
  const fixedCategories = categories.filter(c => c.type === 'FIXED_EXPENSE')
  const variableCategories = categories.filter(c => c.type === 'VARIABLE_EXPENSE')
  const additionalCategories = categories.filter(c => c.type === 'ADDITIONAL_EXPENSE')

  // Calculate if there are any pending changes
  const hasChanges = useMemo(() => {
    return (
      incomePendingChanges.length > 0 ||
      incomeNewRows.length > 0 ||
      incomeDeletedIds.length > 0 ||
      fixedPendingChanges.length > 0 ||
      fixedNewRows.length > 0 ||
      fixedDeletedIds.length > 0 ||
      variablePendingChanges.length > 0 ||
      variableNewRows.length > 0 ||
      variableDeletedIds.length > 0 ||
      additionalPendingChanges.length > 0 ||
      additionalNewRows.length > 0 ||
      additionalDeletedIds.length > 0 ||
      assetPendingChanges.length > 0 ||
      assetNewRows.length > 0 ||
      assetDeletedIds.length > 0
    )
  }, [
    incomePendingChanges, incomeNewRows, incomeDeletedIds,
    fixedPendingChanges, fixedNewRows, fixedDeletedIds,
    variablePendingChanges, variableNewRows, variableDeletedIds,
    additionalPendingChanges, additionalNewRows, additionalDeletedIds,
    assetPendingChanges, assetNewRows, assetDeletedIds
  ])

  // Calculate totals with pending changes
  const calculatedTotals = useMemo(() => {
    const calculateSectionTotal = (
      transactions: Transaction[],
      pendingChanges: PendingChange[],
      newRows: NewTransactionRow[],
      deletedIds: string[]
    ) => {
      const existingTotal = transactions
        .filter(t => !deletedIds.includes(t.id))
        .reduce((sum, t) => {
          const pending = pendingChanges.find(c => c.id === t.id && c.field === 'amount')
          return sum + (pending ? Number(pending.value) : Number(t.amount))
        }, 0)
      const newTotal = newRows.reduce((sum, r) => sum + r.amount, 0)
      return existingTotal + newTotal
  }

    const totalIncome = calculateSectionTotal(incomeTransactions, incomePendingChanges, incomeNewRows, incomeDeletedIds)
    const totalFixed = calculateSectionTotal(fixedExpenses, fixedPendingChanges, fixedNewRows, fixedDeletedIds)
    const totalVariable = calculateSectionTotal(variableExpenses, variablePendingChanges, variableNewRows, variableDeletedIds)
    const totalAdditional = calculateSectionTotal(additionalExpenses, additionalPendingChanges, additionalNewRows, additionalDeletedIds)
    const totalExpenses = totalFixed + totalVariable + totalAdditional

    const assetTotal = assets
      .filter(a => !assetDeletedIds.includes(a.id))
      .reduce((sum, a) => {
        const pending = assetPendingChanges.find(c => c.id === a.id && c.field === 'value')
        return sum + (pending ? Number(pending.value) : Number(a.value))
      }, 0) + assetNewRows.reduce((sum, r) => sum + r.value, 0)

    return {
      totalIncome,
      totalExpenses,
      totalFixed,
      totalVariable,
      totalAdditional,
      assetTotal,
      balance: totalIncome - totalExpenses,
    }
  }, [
    incomeTransactions, incomePendingChanges, incomeNewRows, incomeDeletedIds,
    fixedExpenses, fixedPendingChanges, fixedNewRows, fixedDeletedIds,
    variableExpenses, variablePendingChanges, variableNewRows, variableDeletedIds,
    additionalExpenses, additionalPendingChanges, additionalNewRows, additionalDeletedIds,
    assets, assetPendingChanges, assetNewRows, assetDeletedIds
  ])

  const handleSaveAll = async () => {
    setIsLoading(true)
    try {
      // Process all transaction updates
      const allPendingChanges = [
        ...incomePendingChanges,
        ...fixedPendingChanges,
        ...variablePendingChanges,
        ...additionalPendingChanges,
      ]

      // Group changes by transaction ID
      const groupedChanges = allPendingChanges.reduce((acc, change) => {
        if (!acc[change.id]) {
          acc[change.id] = {}
        }
        acc[change.id][change.field] = change.value
        return acc
      }, {} as Record<string, Record<string, string | number>>)

      // Update existing transactions
      for (const [id, changes] of Object.entries(groupedChanges)) {
      const response = await fetch('/api/transactions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...changes }),
      })
      if (!response.ok) {
        throw new Error('Failed to update transaction')
      }
      }

      // Delete transactions
      const allDeletedIds = [...incomeDeletedIds, ...fixedDeletedIds, ...variableDeletedIds, ...additionalDeletedIds]
      for (const id of allDeletedIds) {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete transaction')
      }
      }

      // Add new transactions
      const allNewRows = [
        ...incomeNewRows,
        ...fixedNewRows,
        ...variableNewRows,
        ...additionalNewRows,
      ]
      for (const row of allNewRows) {
        if (row.categoryId && row.amount > 0) {
      const response = await fetch(`/api/transactions?year=${year}&month=${month}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
              categoryId: row.categoryId,
              amount: row.amount,
              description: row.description || undefined,
              date: new Date().toISOString(),
        }),
      })
      if (!response.ok) {
            throw new Error('Failed to add transaction')
      }
        }
      }

      // Process asset updates
      const groupedAssetChanges = assetPendingChanges.reduce((acc, change) => {
        if (!acc[change.id]) {
          acc[change.id] = {}
  }
        acc[change.id][change.field] = change.value
        return acc
      }, {} as Record<string, Record<string, string | number>>)

      for (const [id, changes] of Object.entries(groupedAssetChanges)) {
      const response = await fetch('/api/assets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...changes }),
      })
      if (!response.ok) {
        throw new Error('Failed to update asset')
      }
      }

      // Delete assets
      for (const id of assetDeletedIds) {
      const response = await fetch(`/api/assets?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete asset')
      }
      }

      // Add new assets
      for (const row of assetNewRows) {
        if (row.name && row.value > 0) {
      const response = await fetch(`/api/assets?year=${year}&month=${month}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: row.name,
              value: row.value,
              description: row.description || undefined,
            }),
      })
      if (!response.ok) {
        throw new Error('Failed to add asset')
      }
        }
      }

      // Clear all pending states
      setIncomePendingChanges([])
      setIncomeNewRows([])
      setIncomeDeletedIds([])
      setFixedPendingChanges([])
      setFixedNewRows([])
      setFixedDeletedIds([])
      setVariablePendingChanges([])
      setVariableNewRows([])
      setVariableDeletedIds([])
      setAdditionalPendingChanges([])
      setAdditionalNewRows([])
      setAdditionalDeletedIds([])
      setAssetPendingChanges([])
      setAssetNewRows([])
      setAssetDeletedIds([])

      await alert({
        title: 'Success',
        message: 'All changes saved successfully!',
        type: 'success',
      })

      router.refresh()
    } catch (error) {
      console.error('Failed to save changes:', error)
      await alert({
        title: 'Error',
        message: 'Failed to save some changes. Please try again.',
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const categoryTotals = [
    { label: 'Fixed Expenses', amount: calculatedTotals.totalFixed, color: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Variable Expenses', amount: calculatedTotals.totalVariable, color: 'bg-pink-50 dark:bg-pink-900/20' },
    { label: 'Additional Expenses', amount: calculatedTotals.totalAdditional, color: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Assets', amount: calculatedTotals.assetTotal, color: 'bg-yellow-50 dark:bg-yellow-900/20' },
  ]

  const handleClone = async () => {
    setIsCloning(true)
    try {
      const targetYear = parseInt(cloneYear)
      const targetMonth = parseInt(cloneMonth)

      // Clone transactions
      const allTransactions = [
        ...incomeTransactions,
        ...fixedExpenses,
        ...variableExpenses,
        ...additionalExpenses,
      ]

      for (const transaction of allTransactions) {
        const response = await fetch(`/api/transactions?year=${targetYear}&month=${targetMonth}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categoryId: transaction.category.id,
            amount: Number(transaction.amount),
            description: transaction.description || undefined,
            date: new Date().toISOString(),
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          throw new Error(`Failed to clone transaction: ${errorData.error || response.statusText}`)
        }
      }

      // Clone assets
      for (const asset of assets) {
        const response = await fetch(`/api/assets?year=${targetYear}&month=${targetMonth}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: asset.name,
            value: Number(asset.value),
            description: asset.description || undefined,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          throw new Error(`Failed to clone asset: ${errorData.error || response.statusText}`)
        }
      }

      setCloneDialogOpen(false)
      await alert({
        title: 'Success',
        message: `Data cloned to ${getMonthName(targetMonth)} ${targetYear}`,
        type: 'success',
      })

      // Navigate to the new month
      router.push(`/month/${targetYear}/${targetMonth}`)
    } catch (error) {
      console.error('Failed to clone data:', error)
      await alert({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to clone data. Please try again.',
        type: 'error',
      })
    } finally {
      setIsCloning(false)
    }
  }

  const getMonthName = (monthNum: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return months[monthNum - 1]
  }

  const yearOptions = Array.from({ length: 5 }, (_, i) => year - 2 + i)
  const monthOptions = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ]

  return (
    <>
      <AlertToast />
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
          <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {formatMonthYear(year, month)}
            </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any cell to edit • Press Enter to confirm
            </p>
          </div>
        </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCloneDialogOpen(true)}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Clone
              </Button>
              <Button
                onClick={handleSaveAll}
                disabled={!hasChanges || isLoading}
                className={`gap-2 ${
                  hasChanges 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save All Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Clone Dialog */}
        <Dialog open={cloneDialogOpen} onOpenChange={setCloneDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Clone Month Data</DialogTitle>
              <DialogDescription>
                Clone all transactions and assets from {formatMonthYear(year, month)} to a new month.
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clone-year">Target Year</Label>
                <Select value={cloneYear} onValueChange={setCloneYear}>
                  <SelectTrigger id="clone-year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clone-month">Target Month</Label>
                <Select value={cloneMonth} onValueChange={setCloneMonth}>
                  <SelectTrigger id="clone-month">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {cloneYear === String(year) && cloneMonth === String(month) && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Warning: You are cloning to the same month. This will duplicate all entries.
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCloneDialogOpen(false)}
                disabled={isCloning}
              >
                Cancel
              </Button>
              <Button
                onClick={handleClone}
                disabled={isCloning}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isCloning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cloning...
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Clone Data
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Main content - 2 column grid layout */}
        <div className="max-w-[1200px] mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Row 1: Pemasukan (1) | Pengeluaran Tidak Tetap (2) */}
            <IncomeSpreadsheet
              transactions={incomeTransactions.map(t => ({
                ...t,
                amount: Number(t.amount)
              }))}
              categories={incomeCategories}
              onChanges={setIncomePendingChanges}
              onNewRows={setIncomeNewRows}
              onDeletedIds={setIncomeDeletedIds}
              pendingChanges={incomePendingChanges}
              newRows={incomeNewRows}
              deletedIds={incomeDeletedIds}
            />

            <ExpenseSpreadsheet
              title="Pengeluaran Tidak Tetap"
              titleColor="bg-teal-600"
              transactions={variableExpenses.map(t => ({
                ...t,
                amount: Number(t.amount)
              }))}
              categories={variableCategories}
              onChanges={setVariablePendingChanges}
              onNewRows={setVariableNewRows}
              onDeletedIds={setVariableDeletedIds}
              pendingChanges={variablePendingChanges}
              newRows={variableNewRows}
              deletedIds={variableDeletedIds}
            />

            {/* Row 2: Pengeluaran Tetap (3) | Pengeluaran Tambahan (4) */}
            <ExpenseSpreadsheet
              title="Pengeluaran Tetap"
              titleColor="bg-green-700"
              transactions={fixedExpenses.map(t => ({
                ...t,
                amount: Number(t.amount)
              }))}
              categories={fixedCategories}
              onChanges={setFixedPendingChanges}
              onNewRows={setFixedNewRows}
              onDeletedIds={setFixedDeletedIds}
              pendingChanges={fixedPendingChanges}
              newRows={fixedNewRows}
              deletedIds={fixedDeletedIds}
            />

            <ExpenseSpreadsheet
              title="Pengeluaran Tambahan"
              titleColor="bg-cyan-600"
              transactions={additionalExpenses.map(t => ({
                ...t,
                amount: Number(t.amount)
              }))}
              categories={additionalCategories}
              onChanges={setAdditionalPendingChanges}
              onNewRows={setAdditionalNewRows}
              onDeletedIds={setAdditionalDeletedIds}
              pendingChanges={additionalPendingChanges}
              newRows={additionalNewRows}
              deletedIds={additionalDeletedIds}
            />

            {/* Row 3: Asset (5) | Summary (6) */}
            <AssetSpreadsheet
              assets={assets.map(a => ({
                ...a,
                value: Number(a.value)
              }))}
              onChanges={setAssetPendingChanges}
              onNewRows={setAssetNewRows}
              onDeletedIds={setAssetDeletedIds}
              pendingChanges={assetPendingChanges}
              newRows={assetNewRows}
              deletedIds={assetDeletedIds}
            />

            <SummaryPanel
              income={calculatedTotals.totalIncome}
              totalExpenses={calculatedTotals.totalExpenses}
              categoryTotals={categoryTotals}
              balance={calculatedTotals.balance}
            />
        </div>
      </div>

        {/* Floating indicator for unsaved changes */}
        {hasChanges && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium z-50">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            You have unsaved changes
        </div>
      )}
    </div>
    </>
  )
}
