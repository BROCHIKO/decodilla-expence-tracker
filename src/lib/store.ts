import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Expense {
  id: string
  date: string
  amount: number
  name: string
  payment: string
  partnerId?: string
  categoryId?: string
  note?: string
  isReimbursed?: boolean
}

export interface Client {
  id: string
  name: string
  contact: string
}

export interface Partner {
  id: string
  name: string
  role: string
  status?: 'Active' | 'Inactive'
}

export interface Category {
  id: string
  name: string
  type: string
  count: number
  status: 'Active' | 'Inactive'
}

interface AppState {
  expenses: Expense[]
  clients: Client[]
  partners: Partner[]
  
  categories: Category[]
  
  addExpense: (expense: Omit<Expense, 'id'>) => void
  deleteExpense: (id: string) => void
  updateExpense: (id: string, expense: Partial<Expense>) => void
  addClient: (client: Omit<Client, 'id'>) => void
  addPartner: (partner: Omit<Partner, 'id'>) => void
  deletePartner: (id: string) => void
  addCategory: (category: Omit<Category, 'id'>) => void
  deleteCategory: (id: string) => void
  updatePartnerStatus: (id: string, status: 'Active' | 'Inactive') => void
  settleReimbursements: (partnerId: string) => void
}

const initialCategories: Category[] = [
  { id: "CAT-1", name: "Meta Ads", type: "Marketing", count: 0, status: "Active" },
  { id: "CAT-2", name: "Google Ads", type: "Marketing", count: 0, status: "Active" },
  { id: "CAT-3", name: "Software Subscriptions", type: "Operations", count: 0, status: "Active" },
  { id: "CAT-4", name: "Office Supplies", type: "Operations", count: 0, status: "Active" },
  { id: "CAT-5", name: "Salary", type: "Payroll", count: 0, status: "Active" },
  { id: "CAT-6", name: "Travel", type: "Miscellaneous", count: 0, status: "Active" },
]

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      expenses: [],
      clients: [],
      partners: [],
      categories: initialCategories,

      addExpense: (expense) => set((state) => ({
        expenses: [{ ...expense, id: crypto.randomUUID() }, ...state.expenses]
      })),

      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(exp => exp.id !== id)
      })),

      updateExpense: (id, updatedExpense) => set((state) => ({
        expenses: state.expenses.map(exp => 
          exp.id === id ? { ...exp, ...updatedExpense } : exp
        )
      })),
      
      addClient: (client) => set((state) => ({
        clients: [{ ...client, id: crypto.randomUUID() }, ...state.clients]
      })),
      
      addPartner: (partner) => set((state) => ({
        partners: [{ ...partner, id: crypto.randomUUID(), status: 'Active' }, ...state.partners]
      })),

      deletePartner: (id) => set((state) => ({
        partners: state.partners.filter(p => p.id !== id)
      })),

      addCategory: (category) => set((state) => ({
        categories: [{ ...category, id: crypto.randomUUID() }, ...state.categories]
      })),

      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
      })),

      updatePartnerStatus: (id, status) => set((state) => ({
        partners: state.partners.map(p => p.id === id ? { ...p, status } : p)
      })),

      settleReimbursements: (partnerId) => set((state) => ({
        expenses: state.expenses.map(exp => 
          exp.partnerId === partnerId
            ? { ...exp, isReimbursed: true }
            : exp
        )
      }))
    }),
    {
      name: 'decodilla-finance-storage', // name of the item in the storage (must be unique)
    }
  )
)
