export interface Invoice {
  id: string;
  tenantId: string;
  tenantName: string;
  number: string;
  status: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  currency: string;
}
