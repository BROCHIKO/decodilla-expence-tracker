import { Sidebar } from "@/components/layout/sidebar"
import { TopNav } from "@/components/layout/top-nav"
import { BottomNav } from "@/components/layout/bottom-nav"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background pb-16 md:pb-0">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-col md:inset-y-0 md:z-50 md:w-64">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
      
      {/* Bottom navigation for mobile */}
      <BottomNav />
    </div>
  )
}
