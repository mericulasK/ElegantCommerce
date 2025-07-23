import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

export interface ProductsFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// Hook for fetching all products with optional filters
export const useProducts = (filters?: ProductsFilters) => {
  return useQuery<Product[]>({
    queryKey: ["/api/products", filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (filters?.category) searchParams.set('category', filters.category);
      if (filters?.minPrice) searchParams.set('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) searchParams.set('maxPrice', filters.maxPrice.toString());
      if (filters?.featured !== undefined) searchParams.set('featured', filters.featured.toString());
      if (filters?.search) searchParams.set('search', filters.search);
      if (filters?.page) searchParams.set('page', filters.page.toString());
      if (filters?.limit) searchParams.set('limit', filters.limit.toString());
      
      const url = `/api/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await apiRequest("GET", url);
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching a single product by ID
export const useProduct = (id: number | string) => {
  return useQuery<Product>({
    queryKey: ["/api/products", id],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/products/${id}`);
      return response.json();
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching featured products
export const useFeaturedProducts = (limit: number = 8) => {
  return useProducts({ featured: true, limit });
};

// Hook for fetching products by category
export const useProductsByCategory = (category: string, limit?: number) => {
  return useProducts({ category, limit });
};

// Hook for searching products
export const useProductSearch = (query: string, limit?: number) => {
  return useProducts({ search: query, limit });
};

// Hook for getting product categories
export const useCategories = () => {
  return useQuery<string[]>({
    queryKey: ["/api/products/categories"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/products/categories");
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Helper hook to prefetch products for better UX
export const usePrefetchProduct = () => {
  const queryClient = useQueryClient();
  
  return (id: number | string) => {
    queryClient.prefetchQuery({
      queryKey: ["/api/products", id],
      queryFn: async () => {
        const response = await apiRequest("GET", `/api/products/${id}`);
        return response.json();
      },
      staleTime: 5 * 60 * 1000,
    });
  };
};
