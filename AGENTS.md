# Pulseflow - Agent Guidelines

## Development Commands

```bash
# Development
npm run dev                 # Start Next.js dev server on localhost:3000
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint (no fix flag by default)

# Database (Prisma + SQLite)
npm run db:generate        # Generate Prisma client
npm run db:push            # Push schema changes to database
npm run db:migrate         # Create and run migration
npm run db:studio          # Open Prisma Studio GUI
npm run db:seed            # Seed database with initial data

# Running a single file
npx tsx path/to/file.ts    # Run TypeScript files directly
```

**Note:** No test framework is currently configured. When running lint, ensure code passes ESLint checks before committing.

## Code Style Guidelines

### File Organization
```
app/                      # Next.js App Router pages (server components by default)
├── (auth)/              # Auth route group
├── (dashboard)/         # Protected dashboard routes
└── api/                 # API route handlers (GET/POST/PUT/DELETE)

components/
├── ui/                  # shadcn/ui components (reusable)
├── dashboard/           # Dashboard-specific components
├── month/              # Monthly edit components
├── settings/           # Settings components
└── shared/             # Shared across features

lib/
├── auth.ts             # NextAuth configuration
├── db.ts               # Prisma client singleton
├── utils.ts            # Utility functions (cn(), dates, calculations)
├── actions/            # Server actions
├── api/                # API service functions (create/update/delete/get)
└── validations/        # Zod schemas for validation
```

### Import Conventions
```typescript
// Use @ alias for absolute imports (maps to ./)
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { transactionSchema } from '@/lib/validations/transaction'

// React imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'

// Third-party imports
import { z } from 'zod'
import { Decimal } from '@prisma/client/runtime/library'
```

### Component Patterns
```typescript
// Client components - must have 'use client' at top
'use client'

import { useState } from 'react'

export function MyComponent({ prop }: Props) {
  // Use React hooks here
  return <div>{prop}</div>
}

// Server components - async for data fetching, no 'use client'
import { auth } from '@/lib/auth'

export default async function ServerPage() {
  const session = await auth()
  return <div>{session?.user?.name}</div>
}
```

### TypeScript & Types
- **Strict mode enabled** - All types must be properly defined
- Use `interface` for component props and object shapes
- Use `type` for unions, primitives, and type transformations
- Import types explicitly: `import { type Session } from 'next-auth'`
- Prisma models use `Decimal` for monetary values: `new Decimal(value)`
- Use Zod schemas for validation in `lib/validations/`:
  ```typescript
  export const transactionSchema = z.object({
    categoryId: z.string().min(1, 'Category is required'),
    amount: z.number().positive('Amount must be positive'),
    date: z.date(),
  })
  export type TransactionInput = z.infer<typeof transactionSchema>
  ```

### Naming Conventions
- **Components**: PascalCase (`TransactionRow.tsx`, `HeartbeatVisualization.tsx`)
- **Functions/Variables**: camelCase (`calculateTotals`, `formatMonthYear`)
- **Files/Exports**: PascalCase for components, camelCase for utilities
- **Constants**: SCREAMING_SNAKE_CASE or PascalCase for exports
- **API Routes**: lowercase with hyphens (`api/monthly-records/route.ts`)

### Error Handling
```typescript
// API Routes - return NextResponse with appropriate status codes
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = schema.parse(body)

    // Verify ownership
    const item = await prisma.item.findUnique({ where: { id } })
    if (!item || item.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Operation failed:', error)
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message, details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Styling with Tailwind CSS
```typescript
import { cn } from '@/lib/utils'

// Use cn() to merge classes (handles Tailwind conflicts)
<div className={cn('base-class', isActive && 'active-class', className)} />

// Common patterns
<div className="glass-card" />              // Glassmorphism effect
<div className="bg-pulse-gradient" />       // Pink → Purple → Cyan gradient
<div className="card" />                    // Base card component style
<div className="text-slate-900 dark:text-slate-50" />  // Dark mode support

// Custom animations
<div className="animate-heartbeat" />       // Heart beat effect
<div className="animate-pulse-glow" />      // Glowing pulse
<div className="animate-float" />           // Floating effect
```

### Database Operations
```typescript
import { prisma } from '@/lib/db'

// Prisma client is a singleton - always import from lib/db.ts
// Use Decimal for monetary values
await prisma.transaction.create({
  data: {
    amount: new Decimal(100.50),
    monthlyRecordId: 'xxx',
    categoryId: 'yyy',
  },
})

// Always include relations when needed
include: { category: true, monthlyRecord: true }

// Use orderBy for consistent ordering
orderBy: { date: 'desc' }
```

### API Route Handlers
- Separate exports for HTTP methods: `GET`, `POST`, `PUT`, `DELETE`
- Always authenticate with `auth()` and check `session.user.id`
- Verify ownership before operations
- Use Zod schemas to validate request bodies
- Return appropriate HTTP status codes (401, 403, 400, 500)
- Include error details for validation errors

### Authentication & Authorization
- Use NextAuth.js v5 (beta) via `@/lib/auth`
- Check session: `const session = await auth()`
- Verify user: `if (!session?.user?.id) return redirect('/auth/signin')`
- Protect API routes: Return 401/403 for unauthorized access
- Session type is extended in `types/next-auth.d.ts`

### Styling Conventions
- Primary colors: Pink (#ec4899), Purple (#8b5cf6), Cyan (#06b6d4)
- Use Tailwind's dark mode: `dark:bg-slate-800 dark:text-slate-50`
- Border radius: `rounded-xl` for cards, `rounded-lg` for smaller elements
- Spacing: Use Tailwind's scale (p-4, m-6, gap-2)
- Custom classes: `glass-card`, `btn`, `card` (check globals.css)
- Font: Outfit for headings and body text

### Best Practices
1. **Server-first approach**: Use server components by default, 'use client' only when needed
2. **Type safety**: Leverage TypeScript strict mode, avoid `any` (use `unknown` for unknown types)
3. **Data fetching**: Fetch data in server components, pass as props to client components
4. **Validation**: Always validate with Zod schemas before database operations
5. **Error handling**: Catch errors in API routes and client-side with try/catch
6. **Database**: Prisma operations should use include for relations, orderBy for sorting
7. **Security**: Always verify user ownership before modifying/deleting resources
8. **Performance**: Use `useMemo` for expensive calculations, `useCallback` for event handlers
9. **Accessibility**: Use semantic HTML, ARIA labels where needed
10. **Code organization**: Group related functions in lib/api/, validations in lib/validations/

### Common Patterns
- **Redirect**: `redirect('/path')` for server-side redirects
- **Router**: `const router = useRouter()` for client navigation
- **Toast alerts**: `const { alert, AlertToast } = useAlert()` from `@/components/ui/alert-toast`
- **Dialogs**: Use shadcn Dialog component from `@/components/ui/dialog`
- **Forms**: React Hook Form with Zod resolvers
- **Icons**: Lucide React icons (`import { Heart, ArrowLeft } from 'lucide-react'`)
