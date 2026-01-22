import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAllMonthlyRecords, getMonthlyRecord } from '@/lib/api/monthly-records'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    const month = searchParams.get('month')

    if (year && month) {
      const monthlyRecord = await getMonthlyRecord(
        session.user.id,
        parseInt(year),
        parseInt(month)
      )

      if (!monthlyRecord) {
        return NextResponse.json({ error: 'Monthly record not found' }, { status: 404 })
      }

      return NextResponse.json(monthlyRecord)
    }

    const monthlyRecords = await getAllMonthlyRecords(session.user.id)
    return NextResponse.json(monthlyRecords)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
