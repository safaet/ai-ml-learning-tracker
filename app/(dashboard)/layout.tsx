import { Toaster } from 'sonner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="min-h-screen bg-slate-950">{children}</main>
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
    </>
  )
}
