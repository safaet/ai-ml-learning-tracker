import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { QuickLogModal } from '@/components/layout/QuickLogModal'
import { Toaster } from 'sonner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex bg-slate-950 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Quick Log Modal */}
      <QuickLogModal />

      {/* Toaster */}
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: '#1e293b',
            border: '1px solid #475569',
            color: '#e2e8f0',
          },
        }}
      />
    </div>
  )
}
