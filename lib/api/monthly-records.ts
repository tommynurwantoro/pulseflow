import { prisma } from '../db'
import { getCurrentMonthYear } from '../utils'

export async function getOrCreateCurrentMonthlyRecord(userId: string) {
  // Verify user exists before creating monthly record
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error(`User with id ${userId} does not exist. Please sign in again.`)
  }

  const { year, month } = getCurrentMonthYear()

  let monthlyRecord = await prisma.monthlyRecord.findUnique({
    where: {
      userId_year_month: {
        userId,
        year,
        month,
      },
    },
    include: {
      transactions: {
        include: {
          category: true,
        },
        orderBy: {
          date: 'desc',
        },
      },
      assets: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!monthlyRecord) {
    monthlyRecord = await prisma.monthlyRecord.create({
      data: {
        userId,
        year,
        month,
      },
      include: {
        transactions: {
          include: {
            category: true,
          },
        },
        assets: [],
      },
    })
  }

  return monthlyRecord
}

export async function getOrCreateMonthlyRecord(userId: string, year: number, month: number) {
  // Verify user exists before creating monthly record
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error(`User with id ${userId} does not exist. Please sign in again.`)
  }

  let monthlyRecord = await prisma.monthlyRecord.findUnique({
    where: {
      userId_year_month: {
        userId,
        year,
        month,
      },
    },
    include: {
      transactions: {
        include: {
          category: true,
        },
        orderBy: {
          date: 'desc',
        },
      },
      assets: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!monthlyRecord) {
    monthlyRecord = await prisma.monthlyRecord.create({
      data: {
        userId,
        year,
        month,
      },
      include: {
        transactions: {
          include: {
            category: true,
          },
        },
        assets: [],
      },
    })
  }

  return monthlyRecord
}

export async function getMonthlyRecord(userId: string, year: number, month: number) {
  return prisma.monthlyRecord.findUnique({
    where: {
      userId_year_month: {
        userId,
        year,
        month,
      },
    },
    include: {
      transactions: {
        include: {
          category: true,
        },
        orderBy: {
          date: 'desc',
        },
      },
      assets: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
}

export async function getAllMonthlyRecords(userId: string) {
  return prisma.monthlyRecord.findMany({
    where: {
      userId,
    },
    orderBy: [
      { year: 'desc' },
      { month: 'desc' },
    ],
    include: {
      transactions: {
        include: {
          category: true,
        },
      },
      assets: true,
    },
  })
}
