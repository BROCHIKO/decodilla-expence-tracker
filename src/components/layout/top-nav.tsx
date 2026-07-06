"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Bell, Search } from "lucide-react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
export function TopNav() {
  const { setTheme, theme } = useTheme()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [authUser, setAuthUser] = useState<{name: string, initials: string} | null>(null)

  useEffect(() => {
    const userString = localStorage.getItem('finance_os_user')
    if (userString) {
      try {
        setAuthUser(JSON.parse(userString))
      } catch (e) {
        console.error("Failed to parse user", e)
      }
    }
  }, [])

  const expenses = useStore((state) => state.expenses)
  const clients = useStore((state) => state.clients)
  const partners = useStore((state) => state.partners)

  const filteredExpenses = expenses.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredPartners = partners.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const pages = [
    { name: "Dashboard", path: "/" },
    { name: "Expenses", path: "/expenses" },
    { name: "Add Expense", path: "/expenses/new" },
    { name: "Partners", path: "/partners" },
    { name: "Reimbursements", path: "/reimbursements" },
    { name: "Clients", path: "/clients" },
    { name: "Categories", path: "/categories" },
    { name: "Reports", path: "/reports" },
    { name: "Monthly Statements", path: "/statements" },
    { name: "Analytics", path: "/analytics" },
    { name: "Settings", path: "/settings" },
  ]
  
  const filteredPages = pages.filter(page => page.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const hasResults = filteredPages.length > 0 || filteredExpenses.length > 0 || filteredClients.length > 0 || filteredPartners.length > 0
  const handleLogout = () => {
    // Clear local storage for the Zustand store and any other user data
    localStorage.removeItem("finance_os_user")
    // Redirect to home or login page and force refresh to clear state
    window.location.href = "/login"
  }

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 sm:text-sm"
            placeholder="Search expenses, clients, partners..."
            type="search"
            name="search"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg max-h-[70vh] overflow-y-auto z-50 overflow-hidden">
              <div className="p-2 space-y-4">
                {hasResults ? (
                  <>
                    {filteredPages.length > 0 && (
                      <div>
                        <h3 className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Links</h3>
                        {filteredPages.map(page => (
                          <Link key={page.path} href={page.path} onClick={() => setSearchQuery("")} className="block px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                            {page.name}
                          </Link>
                        ))}
                      </div>
                    )}
                    {filteredClients.length > 0 && (
                      <div>
                        <h3 className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clients</h3>
                        {filteredClients.map(c => (
                          <Link key={c.id} href={`/clients`} onClick={() => setSearchQuery("")} className="block px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    )}
                    {filteredPartners.length > 0 && (
                      <div>
                        <h3 className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Partners</h3>
                        {filteredPartners.map(p => (
                          <Link key={p.id} href={`/partners/${p.id}`} onClick={() => setSearchQuery("")} className="block px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                            {p.name}
                          </Link>
                        ))}
                      </div>
                    )}
                    {filteredExpenses.length > 0 && (
                      <div>
                        <h3 className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Expenses</h3>
                        {filteredExpenses.map(e => (
                          <Link key={e.id} href={`/expenses`} onClick={() => setSearchQuery("")} className="flex justify-between items-center px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                            <span className="line-clamp-1">{e.name}</span>
                            <span className="text-muted-foreground text-xs ml-4 shrink-0">₹{e.amount}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button variant="ghost" size="icon" className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

          <DropdownMenu>
            <DropdownMenuTrigger className="-m-1.5 flex items-center p-1.5 focus-visible:ring-0 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
              <span className="sr-only">Open user menu</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {authUser?.initials || "AD"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-foreground" aria-hidden="true">
                  {authUser?.name || "Admin User"}
                </span>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
