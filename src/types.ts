export type CustomerStatus = 'active' | 'inactive'

export interface Customer {
  firstName: string
  lastName: string
  id: number
  description: string
  rate: string
  balance: string
  deposit: string
  status: CustomerStatus
}

export type Customers = Array<Customer>
