'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { InlineEditableField } from './InlineEditableField'
import { Button } from '@/components/ui/button'
import { useConfirmation } from '@/components/ui/confirmation-dialog'

interface AssetRowProps {
  asset: {
    id: string
    name: string
    value: any
    description: string | null
  }
  onUpdate: (id: string, data: { name?: string; value?: number; description?: string }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function AssetRow({ asset, onUpdate, onDelete }: AssetRowProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { confirm, ConfirmationDialog } = useConfirmation()

  const handleNameSave = async (value: string | number) => {
    await onUpdate(asset.id, { name: String(value) })
  }

  const handleValueSave = async (value: string | number) => {
    await onUpdate(asset.id, { value: Number(value) })
  }

  const handleDescriptionSave = async (value: string | number) => {
    await onUpdate(asset.id, { description: String(value) })
  }

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Asset',
      description: 'Are you sure you want to delete this asset? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    })
    
    if (confirmed) {
      setIsDeleting(true)
      try {
        await onDelete(asset.id)
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
          value={asset.name}
          onSave={handleNameSave}
          type="text"
          placeholder="Asset name"
          className="w-full"
        />
      </td>
      <td className="px-4 py-3">
        <InlineEditableField
          value={Number(asset.value)}
          onSave={handleValueSave}
          type="number"
          className="w-32"
        />
      </td>
      <td className="px-4 py-3">
        <InlineEditableField
          value={asset.description || ''}
          onSave={handleDescriptionSave}
          type="text"
          placeholder="Description"
          className="w-full"
        />
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
