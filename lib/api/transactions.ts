import { prisma } from '../db'
import { TransactionInput } from '../validations/transaction'
import { Decimal } from '@prisma/client/runtime/library'

export async function createTransaction(
  monthlyRecordId: string,
  data: TransactionInput
) {
  return prisma.transaction.create({
    data: {
      monthlyRecordId,
      categoryId: data.categoryId,
      amount: new Decimal(data.amount),
      description: data.description,
      date: data.date,
    },
    include: {
      category: true,
    },
  })
}

export async function updateTransaction(
  id: string,
  data: Partial<TransactionInput>
) {
  const updateData: any = {}
  
  if (data.categoryId) updateData.categoryId = data.categoryId
  if (data.amount !== undefined) updateData.amount = new Decimal(data.amount)
  if (data.description !== undefined) updateData.description = data.description
  if (data.date) updateData.date = data.date

  return prisma.transaction.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
    },
  })
}

export async function deleteTransaction(id: string) {
  return prisma.transaction.delete({
    where: { id },
  })
}

export async function getTransactionsByMonthlyRecord(monthlyRecordId: string) {
  return prisma.transaction.findMany({
    where: { monthlyRecordId },
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  })
}
