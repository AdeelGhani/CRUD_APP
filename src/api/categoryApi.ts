import type { AxiosResponse } from "axios";
import type { Category } from "../interfaces/interfaces";
import { api } from "./api";

export const getAllCategories = (): Promise<AxiosResponse<Category[]>> => {
  return api.get("Category");
};

export const createCategory = (
  category: Omit<Category, "id">
): Promise<AxiosResponse<Category>> => {
  return api.post("Category", category);
};

export const updateCategory = (
  id: number,
  category: Omit<Category, "id">
): Promise<AxiosResponse<Category>> => {
  return api.put(`Category/${id}`, category);
};

export const deleteCategory = (id: number): Promise<AxiosResponse<void>> => {
  return api.delete(`Category/${id}`);
};

export const getCategoryById = (
  id: number
): Promise<AxiosResponse<Category>> => {
  return api.get(`Category/${id}`);
};
