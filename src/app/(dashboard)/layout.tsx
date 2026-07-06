import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AuthWrapper } from "@/components/auth-wrapper"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthWrapper>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthWrapper>
  )
}
