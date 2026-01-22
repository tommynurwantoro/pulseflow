'use client'

import { useState, useCallback } from 'react'
import { Trash2, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Asset {
  id: string
  name: string
  value: number
  description: string | null
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

interface AssetSpreadsheetProps {
  assets: Asset[]
  onChanges: (changes: PendingAssetChange[]) => void
  onNewRows: (rows: NewAssetRow[]) => void
  onDeletedIds: (ids: string[]) => void
  pendingChanges: PendingAssetChange[]
  newRows: NewAssetRow[]
  deletedIds: string[]
}

export function AssetSpreadsheet({
  assets,
  onChanges,
  onNewRows,
  onDeletedIds,
  pendingChanges,
  newRows,
  deletedIds,
}: AssetSpreadsheetProps) {
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState('')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getDisplayValue = useCallback((asset: Asset, field: 'name' | 'value' | 'description') => {
    const pending = pendingChanges.find(c => c.id === asset.id && c.field === field)
    if (pending) return pending.value
    if (field === 'value') return Number(asset.value)
    return asset[field] || ''
  }, [pendingChanges])

  const handleCellClick = (id: string, field: string, currentValue: string | number) => {
    setEditingCell({ id, field })
    setEditValue(String(currentValue))
  }

  const handleCellBlur = (id: string, field: 'name' | 'value' | 'description') => {
    const asset = assets.find(a => a.id === id)
    if (!asset) {
      // It's a new row
      const newRow = newRows.find(r => r.tempId === id)
      if (newRow) {
        const updatedRows = newRows.map(r => {
          if (r.tempId === id) {
            if (field === 'value') {
              return { ...r, value: parseFloat(editValue) || 0 }
            } else if (field === 'name') {
              return { ...r, name: editValue }
            } else {
              return { ...r, description: editValue }
            }
          }
          return r
        })
        onNewRows(updatedRows)
      }
    } else {
      const originalValue = field === 'value' ? Number(asset.value) : (asset[field] || '')
      const newValue = field === 'value' ? parseFloat(editValue) || 0 : editValue
      
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

  const handleKeyDown = (e: React.KeyboardEvent, id: string, field: 'name' | 'value' | 'description') => {
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
    const tempId = `new-asset-${Date.now()}`
    onNewRows([...newRows, {
      tempId,
      name: '',
      value: 0,
      description: '',
    }])
  }

  const total = assets
    .filter(a => !deletedIds.includes(a.id))
    .reduce((sum, a) => {
      const pending = pendingChanges.find(c => c.id === a.id && c.field === 'value')
      return sum + (pending ? Number(pending.value) : Number(a.value))
    }, 0) + newRows.reduce((sum, r) => sum + r.value, 0)

  const visibleAssets = assets.filter(a => !deletedIds.includes(a.id))

  return (
    <div className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-sm overflow-hidden">
      {/* Header with title */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-300 dark:border-slate-600 bg-teal-600">
        <span className="font-semibold text-sm text-white">Aset</span>
        <button
          onClick={handleAddRow}
          className="w-6 h-6 flex items-center justify-center rounded bg-white/20 hover:bg-white/30 text-white text-sm font-bold transition-colors"
          title="Add new row"
        >
          +
        </button>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_120px_40px] border-b border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700">
        <div className="px-2 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 border-r border-slate-300 dark:border-slate-600 flex items-center gap-1">
          Nama <ChevronDown className="w-3 h-3" />
        </div>
        <div className="px-2 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 border-r border-slate-300 dark:border-slate-600 flex items-center gap-1">
          # Nominal <ChevronDown className="w-3 h-3" />
        </div>
        <div className="px-2 py-1.5" />
      </div>

      {/* Data rows */}
      <div className="divide-y divide-slate-200 dark:divide-slate-600">
        {visibleAssets.map((asset) => {
          const hasChanges = pendingChanges.some(c => c.id === asset.id)
          return (
            <div 
              key={asset.id} 
              className={cn(
                'grid grid-cols-[1fr_120px_40px] hover:bg-slate-50 dark:hover:bg-slate-700/50',
                hasChanges && 'bg-amber-50 dark:bg-amber-900/20'
              )}
            >
              {/* Name cell */}
              <div className="border-r border-slate-200 dark:border-slate-600 min-h-[32px]">
                {editingCell?.id === asset.id && editingCell?.field === 'name' ? (
                  <input
                    autoFocus
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleCellBlur(asset.id, 'name')}
                    onKeyDown={(e) => handleKeyDown(e, asset.id, 'name')}
                    className="w-full h-full px-2 py-1 text-sm bg-white dark:bg-slate-700 border-2 border-blue-500 outline-none"
                  />
                ) : (
                  <div
                    onClick={() => handleCellClick(asset.id, 'name', getDisplayValue(asset, 'name'))}
                    className="px-2 py-1 text-sm cursor-cell hover:bg-blue-50 dark:hover:bg-slate-600/50 h-full flex items-center"
                  >
                    {getDisplayValue(asset, 'name') || <span className="text-slate-400 italic">Click to edit</span>}
                  </div>
                )}
              </div>

              {/* Value cell */}
              <div className="border-r border-slate-200 dark:border-slate-600 min-h-[32px]">
                {editingCell?.id === asset.id && editingCell?.field === 'value' ? (
                  <input
                    autoFocus
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleCellBlur(asset.id, 'value')}
                    onKeyDown={(e) => handleKeyDown(e, asset.id, 'value')}
                    className="w-full h-full px-2 py-1 text-sm bg-white dark:bg-slate-700 border-2 border-blue-500 outline-none text-right"
                  />
                ) : (
                  <div
                    onClick={() => handleCellClick(asset.id, 'value', getDisplayValue(asset, 'value'))}
                    className="px-2 py-1 text-sm cursor-cell hover:bg-blue-50 dark:hover:bg-slate-600/50 h-full flex items-center justify-end"
                  >
                    {formatCurrency(Number(getDisplayValue(asset, 'value')))}
                  </div>
                )}
              </div>

              {/* Delete button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => handleDelete(asset.id)}
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
            className="grid grid-cols-[1fr_120px_40px] bg-green-50 dark:bg-green-900/20"
          >
            {/* Name cell */}
            <div className="border-r border-slate-200 dark:border-slate-600 min-h-[32px]">
              {editingCell?.id === row.tempId && editingCell?.field === 'name' ? (
                <input
                  autoFocus
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleCellBlur(row.tempId, 'name')}
                  onKeyDown={(e) => handleKeyDown(e, row.tempId, 'name')}
                  className="w-full h-full px-2 py-1 text-sm bg-white dark:bg-slate-700 border-2 border-blue-500 outline-none"
                />
              ) : (
                <div
                  onClick={() => handleCellClick(row.tempId, 'name', row.name)}
                  className="px-2 py-1 text-sm cursor-cell hover:bg-blue-50 dark:hover:bg-slate-600/50 h-full flex items-center"
                >
                  {row.name || <span className="text-slate-400 italic">Enter name</span>}
                </div>
              )}
            </div>

            {/* Value cell */}
            <div className="border-r border-slate-200 dark:border-slate-600 min-h-[32px]">
              {editingCell?.id === row.tempId && editingCell?.field === 'value' ? (
                <input
                  autoFocus
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleCellBlur(row.tempId, 'value')}
                  onKeyDown={(e) => handleKeyDown(e, row.tempId, 'value')}
                  className="w-full h-full px-2 py-1 text-sm bg-white dark:bg-slate-700 border-2 border-blue-500 outline-none text-right"
                />
              ) : (
                <div
                  onClick={() => handleCellClick(row.tempId, 'value', row.value)}
                  className="px-2 py-1 text-sm cursor-cell hover:bg-blue-50 dark:hover:bg-slate-600/50 h-full flex items-center justify-end"
                >
                  {row.value > 0 ? formatCurrency(row.value) : <span className="text-slate-400">0</span>}
                </div>
              )}
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

        {/* Empty rows for Excel-like appearance */}
        {Array.from({ length: Math.max(0, 1 - visibleAssets.length - newRows.length) }).map((_, i) => (
          <div 
            key={`empty-${i}`} 
            className="grid grid-cols-[1fr_120px_40px] hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <div className="border-r border-slate-200 dark:border-slate-600 min-h-[32px] px-2 py-1" />
            <div className="border-r border-slate-200 dark:border-slate-600 min-h-[32px] px-2 py-1" />
            <div className="min-h-[32px]" />
          </div>
        ))}

      </div>

      {/* Total row */}
      <div className="grid grid-cols-[1fr_120px_40px] border-t-2 border-slate-400 dark:border-slate-500 bg-slate-100 dark:bg-slate-700">
        <div className="px-2 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 border-r border-slate-300 dark:border-slate-600">
          Total
        </div>
        <div className="px-2 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 text-right border-r border-slate-300 dark:border-slate-600">
          IDR{formatCurrency(total)}
        </div>
        <div />
      </div>
    </div>
  )
}
