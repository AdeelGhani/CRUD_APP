import type { AxiosResponse } from "axios";
import type { Product, ProductResponse } from "../interfaces/interfaces";
import { api } from "./api";

// Get all products with hardcoded query params
export const getAllProducts = (): Promise<AxiosResponse<ProductResponse>> => {
  return api.get("Product", {
    params: {
      pageNumber: 1,
      pageSize: 1000,
    },
  });
};

// Create a new product
export const createProduct = (
  product: Omit<Product, "id">
): Promise<AxiosResponse<Product>> => {
  return api.post("Product", product);
};

// Update an existing product
export const updateProduct = (
  id: number,
  product: Omit<Product, "id">
): Promise<AxiosResponse<Product>> => {
  return api.put(`Product/${id}`, product);
};

// Delete a product
export const deleteProduct = (id: number): Promise<AxiosResponse<void>> => {
  return api.delete(`Product/${id}`);
};

// Get a product by ID
export const getProductById = (
  id: number
): Promise<AxiosResponse<Product>> => {
  return api.get(`Product/${id}`);
};

// Get products by categoryId
export const getProductsByCategoryId = (categoryId: number): Promise<AxiosResponse<ProductResponse>> => {
  return api.get(`Category/${categoryId}/products`, {
    params: {
      pageNumber: 1,
      pageSize: 1000,
    },
  });
};
