export interface Customer {
  Source: string
  'Source ID': string
  'Customer Name': string
  'Company Name': string
  'Account Number': string
  Email: string
  Status: string
  Currency: string
}

export interface Contract {
  Source: string
  'Source ID': string
  'Contract Name': string
  'Customer Source ID': string
  'Plan Name': string
  'Start Date': string
  'End Date': string
  Status: string
  'Billing Period': string
}

export interface Invoice {
  Source: string
  'Source ID': string
  'Invoice Number': string
  'Customer Source ID': string
  Amount: number
  Balance: number
  Status: string
  'Invoice Date': string
  'Due Date': string
  Currency: string
}

export interface Vendor {
  Source: string
  'Source ID': string
  'Vendor Name': string
  'Vendor ID': string
  Email: string
  Phone: string
  Address: string
  'Payment Terms': string
  Status: string
  Currency: string
}

export interface RevRec {
  Source: string
  'Contract ID': string
  Customer: string
  'Performance Obligation': string
  'Obligation Type': string
  'Total Value': number
  Currency: string
  'Term Start': string
  'Term End': string
  'Term Months': number
  'Monthly Recognition': number
  'Months Elapsed': number
  'Recognized To Date': number
  'Deferred Revenue': number
  'Recognition Pct': number
  'Invoice ID': string
  'Invoice Number': string
  'Invoice Status': string
  'Amount Billed': number
  'Amount Paid': number
  'Amount Outstanding': number
  'Standalone Selling Price': number
  'Allocation Pct': number
  Collectability: string
}

export type TabKey = 'customers' | 'contracts' | 'invoices' | 'vendors' | 'revrec'
export type SourceFilter = 'All' | 'Zuora' | 'Chargebee' | 'NetSuite' | 'Stripe'
export type SortDirection = 'asc' | 'desc' | null

export interface SortState {
  column: string | null
  direction: SortDirection
}

export interface BillingData {
  customers: Customer[]
  contracts: Contract[]
  invoices: Invoice[]
  vendors: Vendor[]
  revrec: RevRec[]
  counts: {
    customers: number
    contracts: number
    invoices: number
    vendors: number
    revrec: number
  }
}
