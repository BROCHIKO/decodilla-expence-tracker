"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  Users,
  Briefcase,
  Tags,
  FileText,
  CalendarDays,
  BarChart3,
  Settings,
  HandCoins,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Add Expense", href: "/expenses/new", icon: PlusCircle },
  { name: "Partners", href: "/partners", icon: Users },
  { name: "Reimbursements", href: "/reimbursements", icon: HandCoins },
  { name: "Clients", href: "/clients", icon: Briefcase },
  { name: "Categories", href: "/categories", icon: Tags },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Monthly Statements", href: "/statements", icon: CalendarDays },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
        <Image
          src="/logo.png"
          alt="Decodilla Logo"
          width={32}
          height={32}
          className="rounded-sm"
        />
        <span className="ml-3 font-semibold text-lg tracking-tight">
          Finance OS
        </span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
        <nav className="flex-1 space-y-1 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (pathname?.startsWith(`${item.href}/`) && item.href !== '/')
            
            const linkContent = (
              <>
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </>
            )

            const linkClass = cn(
              "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 w-full text-left",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )

            return (
              <Link
                key={item.name}
                href={item.href}
                className={linkClass}
              >
                {linkContent}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
