export interface Budget {
  id: string;
  userId: string;
  name: string;
  categoryId?: string;
  amount: number;
  spent: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
