'use client'

import { useState, useCallback } from 'react'
import { Trash2, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Transaction {
  id: string
  amount: number
  description: string | null
  date: Date | string
  category: {
    id: string
    name: string
    type: string
  }
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

interface NewRow {
  tempId: string
  categoryId: string
  amount: number
  description: string
}

interface IncomeSpreadsheetProps {
  transactions: Transaction[]
  categories: Category[]
  onChanges: (changes: PendingChange[]) => void
  onNewRows: (rows: NewRow[]) => void
  onDeletedIds: (ids: string[]) => void
  pendingChanges: PendingChange[]
  newRows: NewRow[]
  deletedIds: string[]
}

export function IncomeSpreadsheet({
  transactions,
  categories,
  onChanges,
  onNewRows,
  onDeletedIds,
  pendingChanges,
  newRows,
  deletedIds,
}: IncomeSpreadsheetProps) {
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState('')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getDisplayValue = useCallback((transaction: Transaction, field: 'amount' | 'description') => {
    const pending = pendingChanges.find(c => c.id === transaction.id && c.field === field)
    if (pending) return pending.value
    return field === 'amount' ? Number(transaction.amount) : (transaction.description || '')
  }, [pendingChanges])

  const getCategoryValue = useCallback((transaction: Transaction) => {
    const pending = pendingChanges.find(c => c.id === transaction.id && c.field === 'categoryId')
    if (pending) return String(pending.value)
    return transaction.category.id
  }, [pendingChanges])

  const handleCellClick = (id: string, field: string, currentValue: string | number) => {
    setEditingCell({ id, field })
    setEditValue(String(currentValue))
  }

  const handleCellBlur = (id: string, field: 'amount' | 'description') => {
    const transaction = transactions.find(t => t.id === id)
    if (!transaction) {
      const newRow = newRows.find(r => r.tempId === id)
      if (newRow) {
        const updatedRows = newRows.map(r => {
          if (r.tempId === id) {
            if (field === 'amount') {
              return { ...r, amount: parseFloat(editValue) || 0 }
            } else {
              return { ...r, description: editValue }
            }
          }
          return r
        })
        onNewRows(updatedRows)
      }
    } else {
      const originalValue = field === 'amount' ? Number(transaction.amount) : (transaction.description || '')
      const newValue = field === 'amount' ? parseFloat(editValue) || 0 : editValue
      
      if (String(originalValue) !== String(newValue)) {
        const existingIndex = pendingChanges.findIndex(c => c.id === id && c.field === field)
        if (existingIndex >= 0) {
          const updated = [...pendingChanges]
          updated[existingIndex] = { id, field, value: newValue }
          onChanges(updated)
        } else {
          onChanges([...pendingChanges, { id, field, value: newValue }])
        }
      }
    }
    setEditingCell(null)
  }

  const handleCategoryChange = (id: string, categoryId: string) => {
    const transaction = transactions.find(t => t.id === id)
    if (!transaction) {
      const updatedRows = newRows.map(r => {
        if (r.tempId === id) {
          return { ...r, categoryId }
        }
        return r
      })
      onNewRows(updatedRows)
    } else {
      if (transaction.category.id !== categoryId) {
        const existingIndex = pendingChanges.findIndex(c => c.id === id && c.field === 'categoryId')
        if (existingIndex >= 0) {
          const updated = [...pendingChanges]
          updated[existingIndex] = { id, field: 'categoryId', value: categoryId }
          onChanges(updated)
        } else {
          onChanges([...pendingChanges, { id, field: 'categoryId', value: categoryId }])
        }
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string, field: 'amount' | 'description') => {
    if (e.key === 'Enter') {
      handleCellBlur(id, field)
    } else if (e.key === 'Escape') {
      setEditingCell(null)
    }
  }

  const handleDelete = (id: string) => {
    const isNewRow = newRows.find(r => r.tempId === id)
    if (isNewRow) {
      onNewRows(newRows.filter(r => r.tempId !== id))
    } else {
      if (!deletedIds.includes(id)) {
        onDeletedIds([...deletedIds, id])
      }
    }
  }

  const handleAddRow = () => {
    const tempId = `new-income-${Date.now()}`
    const defaultCategory = categories[0]
    onNewRows([...newRows, {
      tempId,
      categoryId: defaultCategory?.id || '',
      amount: 0,
      description: '',
    }])
  }

  const total = transactions
    .filter(t => !deletedIds.includes(t.id))
    .reduce((sum, t) => {
      const pending = pendingChanges.find(c => c.id === t.id && c.field === 'amount')
      return sum + (pending ? Number(pending.value) : Number(t.amount))
    }, 0) + newRows.reduce((sum, r) => sum + r.amount, 0)

  const visibleTransactions = transactions.filter(t => !deletedIds.includes(t.id))

  return (
    <div className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-sm overflow-hidden">
      {/* Header with title */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-300 dark:border-slate-600 bg-emerald-600">
        <span className="font-semibold text-sm text-white">Pemasukan</span>
        <button
          onClick={handleAddRow}
          className="w-6 h-6 flex items-center justify-center rounded bg-white/20 hover:bg-white/30 text-white text-sm font-bold transition-colors"
          title="Add new row"
        >
          +
        </button>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_120px_100px_40px] border-b border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700">
        <div className="px-2 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 border-r border-slate-300 dark:border-slate-600 flex items-center gap-1">
          Sumber <ChevronDown className="w-3 h-3" />
        </div>
        <div className="px-2 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 border-r border-slate-300 dark:border-slate-600 flex items-center gap-1">
          # Jumlah <ChevronDown className="w-3 h-3" />
        </div>
        <div className="px-2 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 border-r border-slate-300 dark:border-slate-600 flex items-center gap-1">
          Kategori <ChevronDown className="w-3 h-3" />
        </div>
        <div className="px-2 py-1.5" />
      </div>

      {/* Data rows */}
      <div className="divide-y divide-slate-200 dark:divide-slate-600">
        {visibleTransactions.map((transaction) => {
          const hasChanges = pendingChanges.some(c => c.id === transaction.id)
          return (
            <div 
              key={transaction.id} 
              className={cn(
                'grid grid-cols-[1fr_120px_100px_40px] hover:bg-slate-50 dark:hover:bg-slate-700/50',
                hasChanges && 'bg-amber-50 dark:bg-amber-900/20'
              )}
            >
              {/* Description cell */}
              <div className="border-r border-slate-200 dark:border-slate-600 min-h-[32px]">
                {editingCell?.id === transaction.id && editingCell?.field === 'description' ? (
                  <input
                    autoFocus
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleCellBlur(transaction.id, 'description')}
                    onKeyDown={(e) => handleKeyDown(e, transaction.id, 'description')}
                    className="w-full h-full px-2 py-1 text-sm bg-white dark:bg-slate-700 border-2 border-emerald-500 outline-none"
                  />
                ) : (
                  <div
                    onClick={() => handleCellClick(transaction.id, 'description', getDisplayValue(transaction, 'description'))}
                    className="px-2 py-1 text-sm cursor-cell hover:bg-emerald-50 dark:hover:bg-slate-600/50 h-full flex items-center"
                  >
                    {getDisplayValue(transaction, 'description') || <span className="text-slate-400 italic">Click to edit</span>}
                  </div>
                )}
              </div>

              {/* Amount cell */}
              <div className="border-r border-slate-200 dark:border-slate-600 min-h-[32px]">
                {editingCell?.id === transaction.id && editingCell?.field === 'amount' ? (
                  <input
                    autoFocus
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleCellBlur(transaction.id, 'amount')}
                    onKeyDown={(e) => handleKeyDown(e, transaction.id, 'amount')}
                    className="w-full h-full px-2 py-1 text-sm bg-white dark:bg-slate-700 border-2 border-emerald-500 outline-none text-right"
                  />
                ) : (
                  <div
                    onClick={() => handleCellClick(transaction.id, 'amount', getDisplayValue(transaction, 'amount'))}
                    className="px-2 py-1 text-sm cursor-cell hover:bg-emerald-50 dark:hover:bg-slate-600/50 h-full flex items-center justify-end text-emerald-600 dark:text-emerald-400 font-medium"
                  >
                    {formatCurrency(Number(getDisplayValue(transaction, 'amount')))}
                  </div>
                )}
              </div>

              {/* Category select cell */}
              <div className="border-r border-slate-200 dark:border-slate-600 min-h-[32px]">
                <Select
                  value={getCategoryValue(transaction)}
                  onValueChange={(value) => handleCategoryChange(transaction.id, value)}
                >
                  <SelectTrigger className="h-full w-full border-0 rounded-none text-sm px-2 py-1 focus:ring-0 focus:ring-offset-0 shadow-none hover:bg-emerald-50 dark:hover:bg-slate-600/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="text-sm">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Delete button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}

        {/* New rows */}
        {newRows.map((row) => (
          <div 
            key={row.tempId} 
            className="grid grid-cols-[1fr_120px_100px_40px] bg-green-50 dark:bg-green-900/20"
          >
            {/* Description cell */}
            <div className="border-r border-slate-200 dark:border-slate-600 min-h-[32px]">
              {editingCell?.id === row.tempId && editingCell?.field === 'description' ? (
                <input
                  autoFocus
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleCellBlur(row.tempId, 'description')}
                  onKeyDown={(e) => handleKeyDown(e, row.tempId, 'description')}
                  className="w-full h-full px-2 py-1 text-sm bg-white dark:bg-slate-700 border-2 border-emerald-500 outline-none"
                />
              ) : (
                <div
                  onClick={() => handleCellClick(row.tempId, 'description', row.description)}
                  className="px-2 py-1 text-sm cursor-cell hover:bg-emerald-50 dark:hover:bg-slate-600/50 h-full flex items-center"
                >
                  {row.description || <span className="text-slate-400 italic">Enter source</span>}
                </div>
              )}
            </div>

            {/* Amount cell */}
            <div className="border-r border-slate-200 dark:border-slate-600 min-h-[32px]">
              {editingCell?.id === row.tempId && editingCell?.field === 'amount' ? (
                <input
                  autoFocus
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleCellBlur(row.tempId, 'amount')}
                  onKeyDown={(e) => handleKeyDown(e, row.tempId, 'amount')}
                  className="w-full h-full px-2 py-1 text-sm bg-white dark:bg-slate-700 border-2 border-emerald-500 outline-none text-right"
                />
              ) : (
                <div
                  onClick={() => handleCellClick(row.tempId, 'amount', row.amount)}
                  className="px-2 py-1 text-sm cursor-cell hover:bg-emerald-50 dark:hover:bg-slate-600/50 h-full flex items-center justify-end"
                >
                  {row.amount > 0 ? formatCurrency(row.amount) : <span className="text-slate-400">0</span>}
                </div>
              )}
            </div>

            {/* Category select cell */}
            <div className="border-r border-slate-200 dark:border-slate-600 min-h-[32px]">
              <Select
                value={row.categoryId}
                onValueChange={(value) => handleCategoryChange(row.tempId, value)}
              >
                <SelectTrigger className="h-full w-full border-0 rounded-none text-sm px-2 py-1 focus:ring-0 focus:ring-offset-0 shadow-none hover:bg-emerald-50 dark:hover:bg-slate-600/50">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-sm">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Delete button */}
            <div className="flex items-center justify-center">
              <button
                onClick={() => handleDelete(row.tempId)}
                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty rows */}
        {Array.from({ length: Math.max(0, 1 - visibleTransactions.length - newRows.length) }).map((_, i) => (
          <div 
            key={`empty-${i}`} 
            className="grid grid-cols-[1fr_120px_100px_40px] hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <div className="border-r border-slate-200 dark:border-slate-600 min-h-[32px] px-2 py-1" />
            <div className="border-r border-slate-200 dark:border-slate-600 min-h-[32px] px-2 py-1" />
            <div className="border-r border-slate-200 dark:border-slate-600 min-h-[32px] px-2 py-1" />
            <div className="min-h-[32px]" />
          </div>
        ))}

      </div>

      {/* Total row */}
      <div className="grid grid-cols-[1fr_120px_100px_40px] border-t-2 border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30">
        <div className="px-2 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300 border-r border-slate-300 dark:border-slate-600">
          Total Income
        </div>
        <div className="px-2 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300 text-right border-r border-slate-300 dark:border-slate-600">
          IDR{formatCurrency(total)}
        </div>
        <div className="border-r border-slate-300 dark:border-slate-600" />
        <div />
      </div>
    </div>
  )
}
