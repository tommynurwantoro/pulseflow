'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConfirmation } from '@/components/ui/confirmation-dialog'
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
import { CategoryType } from '@/lib/validations/category'

interface Category {
  id: string
  name: string
  type: CategoryType
}

interface CategoryManagerProps {
  initialCategories: Category[]
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [type, setType] = useState<CategoryType>('INCOME')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const { confirm, ConfirmationDialog } = useConfirmation()
  const { alert, AlertToast } = useAlert()

  const categoryTypeLabels = {
    INCOME: 'Income',
    FIXED_EXPENSE: 'Fixed Expense',
    VARIABLE_EXPENSE: 'Variable Expense',
    ADDITIONAL_EXPENSE: 'Additional Expense',
  }

  const resetForm = () => {
    setName('')
    setType('INCOME')
    setEditingCategory(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      const url = editingCategory
        ? '/api/categories'
        : '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editingCategory
            ? { id: editingCategory.id, name, type }
            : { name, type }
        ),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save category')
      }

      const savedCategory = await response.json()
      
      // Update local state immediately
      if (editingCategory) {
        // Update existing category
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id 
            ? savedCategory
            : cat
        ))
      } else {
        // Add new category
        setCategories([...categories, savedCategory])
      }

      // Close modal and reset form
      setIsDialogOpen(false)
      resetForm()
      
      // Refresh from server to ensure consistency
      router.refresh()
    } catch (error: any) {
      await alert({
        title: 'Error',
        message: error.message || 'Failed to save category',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setName(category.name)
    setType(category.type)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Delete Category',
      description: 'Are you sure you want to delete this category? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    })
    
    if (!confirmed) {
      return
    }

    setIsDeleting(id)
    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      // Update local state immediately
      setCategories(categories.filter(cat => cat.id !== id))
      
      // Refresh from server to ensure consistency
      router.refresh()
    } catch (error) {
      await alert({
        title: 'Error',
        message: 'Failed to delete category',
        type: 'error',
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const groupedCategories = categories.reduce((acc, cat) => {
    if (!acc[cat.type]) {
      acc[cat.type] = []
    }
    acc[cat.type].push(cat)
    return acc
  }, {} as Record<CategoryType, Category[]>)

  return (
    <>
      <ConfirmationDialog />
      <AlertToast />
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Categories
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            resetForm()
          } else if (!editingCategory) {
            // Reset form when opening for new category
            setName('')
            setType('INCOME')
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? 'Update the category details below.'
                  : 'Create a new category for your transactions.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="px-6 space-y-5">
              <div className="space-y-2.5">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g., Salary, Rent, Groceries"
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="type">Category Type</Label>
                <Select value={type} onValueChange={(value) => setType(value as CategoryType)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="FIXED_EXPENSE">Fixed Expense</SelectItem>
                    <SelectItem value="VARIABLE_EXPENSE">Variable Expense</SelectItem>
                    <SelectItem value="ADDITIONAL_EXPENSE">Additional Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 sm:flex-initial">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-initial">
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No categories yet. Create your first category to get started.
        </p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedCategories).map(([type, cats]) => (
            <div key={type}>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {categoryTypeLabels[type as CategoryType]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {cats.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting === category.id}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  )
}
