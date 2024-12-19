export type Invoice = {
  billedTo: string
  invoiceUrl: string
  startDate: number
  endDate: number
  items: {
    description: string
    amount: number
    currency: string
  }[]
  total: number
  currency: string
}
