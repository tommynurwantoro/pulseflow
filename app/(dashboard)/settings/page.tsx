import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getCategoriesByUser } from '@/lib/api/categories'
import { CategoryManager } from '@/components/settings/CategoryManager'
import { CategoryType } from '@/lib/validations/category'

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const categories = await getCategoriesByUser(session.user.id)

  // Map to ensure type compatibility with CategoryManager
  const typedCategories: Array<{ id: string; name: string; type: CategoryType }> = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    type: cat.type as CategoryType,
  }))

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-slate-50">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
          Manage your transaction categories
        </p>
      </div>

      <CategoryManager initialCategories={typedCategories} />
    </div>
  )
}
