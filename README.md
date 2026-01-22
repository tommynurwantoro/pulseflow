# Pulseflow

A modern monthly financial tracker application with a unique "heartbeat" visualization concept.

## Tech Stack

- **Framework:** Next.js 16
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** Auth.js (NextAuth)
- **Styling:** Tailwind CSS + shadcn/ui
- **Forms:** React Hook Form
- **Validation:** Zod

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and NextAuth secret
```

3. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
pulseflow/
├── app/                    # Next.js app router
│   ├── (auth)/            # Auth routes (login, signup)
│   ├── (dashboard)/       # Protected routes
│   │   ├── dashboard/     # Dashboard page
│   │   ├── history/       # History page
│   │   ├── month/         # Monthly edit/detail page
│   │   └── settings/      # Settings page
│   ├── api/               # API routes
│   │   └── auth/          # Auth.js API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home/redirect page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   ├── history/          # History-specific components
│   ├── month/            # Monthly edit components
│   └── shared/           # Shared components
├── lib/                  # Utility functions
│   ├── auth.ts           # Auth configuration
│   ├── db.ts             # Prisma client
│   ├── utils.ts          # General utilities
│   └── validations/      # Zod schemas
├── prisma/               # Prisma files
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── types/                # TypeScript types
└── hooks/                # Custom React hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed the database

## Features

- 📊 Dashboard with heartbeat visualization
- 📅 Monthly financial tracking
- 📝 Inline editing for transactions
- 🏷️ Custom categories
- 📈 Financial health scoring
- 💡 Rule-based financial suggestions
