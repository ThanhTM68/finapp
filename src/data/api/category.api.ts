import { httpClient } from './httpClient';
import { Category, CreateCategoryPayload } from '../../domain/category/category.types';

export const categoryApi = {
  getAll: () => httpClient.get<Category[]>('/categories'),
  create: (payload: CreateCategoryPayload) => httpClient.post<Category>('/categories', payload),
  update: (id: string, payload: Partial<CreateCategoryPayload>) =>
    httpClient.put<Category>(`/categories/${id}`, payload),
  delete: (id: string) => httpClient.delete<void>(`/categories/${id}`),
};
