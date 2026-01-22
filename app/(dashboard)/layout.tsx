import { Navbar } from '@/components/shared/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 max-w-7xl">
        {children}
      </main>
    </div>
  )
}
