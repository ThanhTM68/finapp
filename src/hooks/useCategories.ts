import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/category/category.service';
import { TransactionType } from '../domain/common/base.types';

export function useCategories(type?: TransactionType) {
  const query = useQuery({
    queryKey: ['categories', type],
    queryFn: categoryService.getAll,
  });

  const categories = (query.data ?? []).filter((item) => {
    if (!type) return true;
    if (type === 'transfer') return item.type === 'expense';
    return item.type === type;
  });

  return {
    categories,
    isLoading: query.isLoading,
  };
}
