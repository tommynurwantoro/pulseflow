import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { assetSchema } from '@/lib/validations/asset'
import { createAsset, updateAsset, deleteAsset } from '@/lib/api/assets'
import { getOrCreateMonthlyRecord } from '@/lib/api/monthly-records'

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

    const assets = await prisma.asset.findMany({
      where: { monthlyRecordId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(assets)
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
    const validatedData = assetSchema.parse(body)

    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    const month = searchParams.get('month')

    if (!year || !month) {
      return NextResponse.json({ error: 'Year and month are required' }, { status: 400 })
    }

    const monthlyRecord = await getOrCreateMonthlyRecord(
      session.user.id,
      parseInt(year),
      parseInt(month)
    )

    const asset = await createAsset(monthlyRecord.id, validatedData)

    return NextResponse.json(asset, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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
      return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 })
    }

    // Verify ownership
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: { monthlyRecord: true },
    })

    if (!asset || asset.monthlyRecord.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updatedAsset = await updateAsset(id, data)

    return NextResponse.json(updatedAsset)
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
      return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 })
    }

    // Verify ownership
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: { monthlyRecord: true },
    })

    if (!asset || asset.monthlyRecord.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await deleteAsset(id)

    return NextResponse.json({ message: 'Asset deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
