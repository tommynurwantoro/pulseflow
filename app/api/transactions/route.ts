import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { transactionSchema } from '@/lib/validations/transaction'
import { getOrCreateCurrentMonthlyRecord, getOrCreateMonthlyRecord } from '@/lib/api/monthly-records'
import { createTransaction, updateTransaction, deleteTransaction } from '@/lib/api/transactions'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const monthlyRecordId = searchParams.get('monthlyRecordId')

    if (!monthlyRecordId) {
      return NextResponse.json({ error: 'monthlyRecordId is required' }, { status: 400 })
    }

    // Verify ownership
    const monthlyRecord = await prisma.monthlyRecord.findUnique({
      where: { id: monthlyRecordId },
    })

    if (!monthlyRecord || monthlyRecord.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const transactions = await prisma.transaction.findMany({
      where: { monthlyRecordId },
      include: { category: true },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Convert date string to Date object if needed
    if (body.date && typeof body.date === 'string') {
      body.date = new Date(body.date)
    }
    
    const validatedData = transactionSchema.parse(body)

    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    const month = searchParams.get('month')

    let monthlyRecordId: string

    if (year && month) {
      const monthlyRecord = await getOrCreateMonthlyRecord(
        session.user.id,
        parseInt(year),
        parseInt(month)
      )
      monthlyRecordId = monthlyRecord.id
    } else {
      const monthlyRecord = await getOrCreateCurrentMonthlyRecord(session.user.id)
      monthlyRecordId = monthlyRecord.id
    }

    // Verify category belongs to user
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    })

    if (!category || (category.userId && category.userId !== session.user.id)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    const transaction = await createTransaction(monthlyRecordId, validatedData)

    return NextResponse.json(transaction, { status: 201 })
  } catch (error: any) {
    console.error('Transaction creation error:', error)
    if (error.name === 'ZodError') {
      const errorMessage = error.errors?.[0]?.message || 'Validation error'
      return NextResponse.json({ error: errorMessage, details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    // Verify ownership
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { monthlyRecord: true },
    })

    if (!transaction || transaction.monthlyRecord.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updatedTransaction = await updateTransaction(id, data)

    return NextResponse.json(updatedTransaction)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    // Verify ownership
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { monthlyRecord: true },
    })

    if (!transaction || transaction.monthlyRecord.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await deleteTransaction(id)

    return NextResponse.json({ message: 'Transaction deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
