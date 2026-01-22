import { z } from 'zod'

export const assetSchema = z.object({
  name: z.string().min(1, 'Asset name is required').max(100, 'Asset name is too long'),
  value: z.number().nonnegative('Value must be non-negative'),
  description: z.string().optional(),
})

export type AssetInput = z.infer<typeof assetSchema>
