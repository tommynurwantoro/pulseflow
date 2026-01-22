'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { InlineEditableField } from './InlineEditableField'
import { Button } from '@/components/ui/button'
import { useConfirmation } from '@/components/ui/confirmation-dialog'

interface TransactionRowProps {
  transaction: {
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
  onUpdate: (id: string, data: { amount?: number; description?: string }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TransactionRow({ transaction, onUpdate, onDelete }: TransactionRowProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { confirm, ConfirmationDialog } = useConfirmation()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const handleAmountSave = async (value: string | number) => {
    await onUpdate(transaction.id, { amount: Number(value) })
  }

  const handleDescriptionSave = async (value: string | number) => {
    await onUpdate(transaction.id, { description: String(value) })
  }

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Transaction',
      description: 'Are you sure you want to delete this transaction? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    })
    
    if (confirmed) {
      setIsDeleting(true)
      try {
        await onDelete(transaction.id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <>
      <ConfirmationDialog />
      <tr className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800">
      <td className="px-4 py-3">
        <InlineEditableField
          value={transaction.description || ''}
          onSave={handleDescriptionSave}
          type="text"
          placeholder="Description"
          className="w-full"
        />
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">{transaction.category.name}</span>
      </td>
      <td className="px-4 py-3">
        <InlineEditableField
          value={Number(transaction.amount)}
          onSave={handleAmountSave}
          type="number"
          className="w-32"
        />
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {formatDate(transaction.date)}
      </td>
      <td className="px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
    </>
  )
}
