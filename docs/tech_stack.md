| Layer | New Technology | Why? |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16** | Unchanged. |
| **Database** | **Your PostgreSQL** | Your own infrastructure. |
| **ORM** | **Prisma** | Best tool to connect Next.js to raw PostgreSQL. Handles schemas and migrations beautifully. |
| **Auth** | **Auth.js (NextAuth)** | Secure authentication provider that works with Prisma/Postgres. |
| **Styling** | **Tailwind + shadcn/ui** | Unchanged. |
| **Forms** | **React Hook Form** | Unchanged. |
| **Validation** | **Zod** | Highly recommended to use with Prisma and React Hook Form to ensure no bad data enters your DB. |