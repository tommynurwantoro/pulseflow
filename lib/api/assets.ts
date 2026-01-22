import { prisma } from '../db'
import { AssetInput } from '../validations/asset'
import { Decimal } from '@prisma/client/runtime/library'

export async function createAsset(monthlyRecordId: string, data: AssetInput) {
  return prisma.asset.create({
    data: {
      monthlyRecordId,
      name: data.name,
      value: new Decimal(data.value),
      description: data.description,
    },
  })
}

export async function updateAsset(id: string, data: Partial<AssetInput>) {
  const updateData: any = {}
  
  if (data.name) updateData.name = data.name
  if (data.value !== undefined) updateData.value = new Decimal(data.value)
  if (data.description !== undefined) updateData.description = data.description

  return prisma.asset.update({
    where: { id },
    data: updateData,
  })
}

export async function deleteAsset(id: string) {
  return prisma.asset.delete({
    where: { id },
  })
}
