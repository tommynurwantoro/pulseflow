import { z } from 'zod'

export const CategoryType = {
  INCOME: 'INCOME',
  FIXED_EXPENSE: 'FIXED_EXPENSE',
  VARIABLE_EXPENSE: 'VARIABLE_EXPENSE',
  ADDITIONAL_EXPENSE: 'ADDITIONAL_EXPENSE',
} as const

export type CategoryType = typeof CategoryType[keyof typeof CategoryType]

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name is too long'),
  type: z.enum(['INCOME', 'FIXED_EXPENSE', 'VARIABLE_EXPENSE', 'ADDITIONAL_EXPENSE']),
})

export type CategoryInput = z.infer<typeof categorySchema>
