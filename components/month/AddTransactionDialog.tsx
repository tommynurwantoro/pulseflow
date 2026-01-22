'use client'

import { useState } from 'react'
import { Plus, Minus, TrendingUp, TrendingDown, Tag, DollarSign, FileText, Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAlert } from '@/components/ui/alert-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Category {
  id: string
  name: string
  type: string
}

interface AddTransactionDialogProps {
  categories: Category[]
  onAdd: (data: { categoryId: string; amount: number; description?: string; date: Date }) => Promise<void>
  type: 'income' | 'expense'
}

export function AddTransactionDialog({ categories, onAdd, type }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false)
  const [categoryId, setCategoryId] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { alert, AlertToast } = useAlert()

  const filteredCategories = categories.filter(
    cat => type === 'income' ? cat.type === 'INCOME' : cat.type !== 'INCOME'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId || !amount) {
      await alert({
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        type: 'warning',
      })
      return
    }

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      await alert({
        title: 'Validation Error',
        message: 'Please enter a valid positive amount',
        type: 'warning',
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onAdd({
        categoryId,
        amount: parsedAmount,
        description: description || undefined,
        date: new Date(date),
      })
      setOpen(false)
      setCategoryId('')
      setAmount('')
      setDescription('')
      setDate(new Date().toISOString().split('T')[0])
    } catch (error: any) {
      console.error('Failed to add transaction:', error)
      await alert({
        title: 'Error',
        message: error.message || 'Failed to add transaction. Please try again.',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const TypeIcon = type === 'income' ? TrendingUp : TrendingDown
  const isIncome = type === 'income'

  return (
    <>
      <AlertToast />
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className={isIncome 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-red-500 hover:bg-red-600 text-white'
          }
        >
          {isIncome ? (
            <Plus className="w-4 h-4 mr-2" />
          ) : (
            <Minus className="w-4 h-4 mr-2" />
          )}
          Add {type === 'income' ? 'Income' : 'Expense'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-xl ${
              isIncome 
                ? 'bg-green-100 dark:bg-green-500/20' 
                : 'bg-red-100 dark:bg-red-500/20'
            }`}>
              <TypeIcon className={`w-6 h-6 ${
                isIncome 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`} />
            </div>
            <div>
              <DialogTitle>Add {type === 'income' ? 'Income' : 'Expense'}</DialogTitle>
              <DialogDescription className="mt-1">
                Record a new {type === 'income' ? 'income' : 'expense'} transaction
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="px-6 space-y-5">
          {/* Category Field */}
          <div className="space-y-2.5">
            <Label htmlFor="category" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <Tag className="w-4 h-4" />
              <span>Category</span>
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Field */}
          <div className="space-y-2.5">
            <Label htmlFor="amount" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Amount</span>
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 font-medium">
                IDR
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="pl-16"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2.5">
            <Label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Description <span className="text-xs font-normal text-slate-500">(optional)</span></span>
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note about this transaction"
            />
          </div>

          {/* Date Field */}
          <div className="space-y-2.5">
            <Label htmlFor="date" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4" />
              <span>Date</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={`flex-1 sm:flex-initial ${
                isIncome 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  {isIncome ? (
                    <Plus className="w-4 h-4 mr-2" />
                  ) : (
                    <Minus className="w-4 h-4 mr-2" />
                  )}
                  Add Transaction
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
