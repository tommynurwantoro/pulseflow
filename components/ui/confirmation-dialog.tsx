'use client'

import { useState, useCallback } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AlertTriangle, Info } from 'lucide-react'

interface ConfirmationOptions {
  title?: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

let resolvePromise: ((value: boolean) => void) | null = null

export function useConfirmation() {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmationOptions>({
    description: '',
    variant: 'default',
  })

  const confirm = useCallback((opts: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions({
        title: opts.title || 'Confirm Action',
        description: opts.description,
        confirmText: opts.confirmText || 'Confirm',
        cancelText: opts.cancelText || 'Cancel',
        variant: opts.variant || 'default',
      })
      setOpen(true)
      resolvePromise = resolve
    })
  }, [])

  const handleConfirm = () => {
    setOpen(false)
    if (resolvePromise) {
      resolvePromise(true)
      resolvePromise = null
    }
  }

  const handleCancel = () => {
    setOpen(false)
    if (resolvePromise) {
      resolvePromise(false)
      resolvePromise = null
    }
  }

  const ConfirmationDialog = () => (
    <AlertDialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleCancel()
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-xl ${
              options.variant === 'destructive'
                ? 'bg-red-100 dark:bg-red-500/20'
                : 'bg-blue-100 dark:bg-blue-500/20'
            }`}>
              {options.variant === 'destructive' ? (
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              ) : (
                <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <AlertDialogTitle>{options.title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="mt-2">
            {options.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {options.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={options.variant === 'destructive' 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : ''
            }
          >
            {options.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return { confirm, ConfirmationDialog }
}
