import { z } from 'zod'

export const transactionSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
  date: z.date(),
})

export type TransactionInput = z.infer<typeof transactionSchema>
