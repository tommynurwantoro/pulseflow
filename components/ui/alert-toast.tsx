'use client'

import { useState, useCallback } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react'

type AlertType = 'success' | 'error' | 'info' | 'warning'

interface AlertOptions {
  title?: string
  message: string
  type?: AlertType
  buttonText?: string
}

let resolvePromise: (() => void) | null = null

export function useAlert() {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<AlertOptions>({
    message: '',
    type: 'info',
  })

  const alert = useCallback((opts: string | AlertOptions): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof opts === 'string') {
        setOptions({
          title: 'Alert',
          message: opts,
          type: 'info',
          buttonText: 'OK',
        })
      } else {
        setOptions({
          title: opts.title || 'Alert',
          message: opts.message,
          type: opts.type || 'info',
          buttonText: opts.buttonText || 'OK',
        })
      }
      setOpen(true)
      resolvePromise = resolve
    })
  }, [])

  const handleClose = () => {
    setOpen(false)
    if (resolvePromise) {
      resolvePromise()
      resolvePromise = null
    }
  }

  const getIcon = () => {
    switch (options.type) {
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
      default:
        return <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
    }
  }

  const getBgColor = () => {
    switch (options.type) {
      case 'success':
        return 'bg-emerald-100 dark:bg-emerald-500/20'
      case 'error':
        return 'bg-red-100 dark:bg-red-500/20'
      case 'warning':
        return 'bg-amber-100 dark:bg-amber-500/20'
      default:
        return 'bg-blue-100 dark:bg-blue-500/20'
    }
  }

  const AlertToast = () => (
    <AlertDialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose()
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-xl ${getBgColor()}`}>
              {getIcon()}
            </div>
            <AlertDialogTitle>{options.title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="mt-2">
            {options.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose}>
            {options.buttonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return { alert, AlertToast }
}
