export type ExpenseCategory =
  | 'Shopping'
  | 'Dining'
  | 'Transport'
  | 'Entertainment'
  | 'Utilities'
  | 'Groceries'
  | 'Health'
  | 'General';

export interface ExpenseDto {
  key: number;
  amount: number;
  merchant: string;
  currency: string;
  category: ExpenseCategory;
  createdAt: string | Date;
  notes?: string;
}

export interface UserDto {
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | number;
  email: string;
  profilePic: string;
  monthlyBudget: number;
  currency: string;
}

export interface SpendInsight {
  id: string;
  label: string;
  value: string;
  statusType?: 'success' | 'warning' | 'error' | 'info';
}
