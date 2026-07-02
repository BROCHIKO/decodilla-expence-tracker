"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ReceiptText, Plus, FileText, Settings } from "lucide-react"

import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Expenses", href: "/expenses", icon: ReceiptText },
  { name: "Add", href: "/expenses/new", icon: Plus, isPrimary: true },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border pb-safe">
      <nav className="flex justify-around items-center h-16 px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          
          if (item.isPrimary) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-transform active:scale-95 -mt-6"
              >
                <item.icon className="h-6 w-6" />
                <span className="sr-only">{item.name}</span>
              </Link>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full space-y-1 text-muted-foreground hover:text-foreground transition-colors",
                isActive && "text-foreground font-medium"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
