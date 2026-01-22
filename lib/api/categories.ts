import { prisma } from '../db'
import { CategoryInput } from '../validations/category'
import { CategoryType } from '@prisma/client'

export async function getCategoriesByUser(userId: string, type?: CategoryType) {
  return prisma.category.findMany({
    where: {
      userId,
      ...(type && { type }),
    },
    orderBy: {
      name: 'asc',
    },
  })
}

export async function createCategory(userId: string, data: CategoryInput) {
  return prisma.category.create({
    data: {
      ...data,
      userId,
    },
  })
}

export async function updateCategory(id: string, data: Partial<CategoryInput>) {
  return prisma.category.update({
    where: { id },
    data,
  })
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({
    where: { id },
  })
}
