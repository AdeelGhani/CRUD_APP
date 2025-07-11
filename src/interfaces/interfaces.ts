
export interface Category {
  id: number;
  categoryName: string;
  categoryDescription: string;
  imageUrl: string;
  isActive: boolean;
  createdDate: string;
  updatedDate?: string | null;
}
export interface Product {
  id: number;
  productName: string;
  productDescription: string;
  price: number;
  stockQuantity: number;
  sku: string;
  imageUrl: string;
  isActive: boolean;
  categoryId: number;
  createdDate: string;
  updatedDate?: string | null;
}

export interface CategoryResponse {
  data: Category[];
}

export interface ProductResponse {
  items: Product[];
  // Optionally, you can add pagination fields if needed, e.g.:
  // totalCount?: number;
  // pageNumber?: number;
  // pageSize?: number;
}
