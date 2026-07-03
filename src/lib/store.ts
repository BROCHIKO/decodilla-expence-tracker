import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Expense {
  id: string
  date: string
  amount: number
  name: string
  payment: string
  note?: string
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
}

interface AppState {
  expenses: Expense[]
  clients: Client[]
  partners: Partner[]
  
  addExpense: (expense: Omit<Expense, 'id'>) => void
  addClient: (client: Omit<Client, 'id'>) => void
  addPartner: (partner: Omit<Partner, 'id'>) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      expenses: [],
      clients: [],
      partners: [],

      addExpense: (expense) => set((state) => ({
        expenses: [{ ...expense, id: crypto.randomUUID() }, ...state.expenses]
      })),
      
      addClient: (client) => set((state) => ({
        clients: [{ ...client, id: crypto.randomUUID() }, ...state.clients]
      })),
      
      addPartner: (partner) => set((state) => ({
        partners: [{ ...partner, id: crypto.randomUUID() }, ...state.partners]
      }))
    }),
    {
      name: 'decodilla-finance-storage', // name of the item in the storage (must be unique)
    }
  )
)
