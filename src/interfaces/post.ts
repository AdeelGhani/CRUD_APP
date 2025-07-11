export interface Post {
  id?: number;
  title: string;
  body: string;
  userId?: number;
}

export interface PostResponse {
  data: Post[];
}
export interface CreateOrUpdatePost {
  data: Post;
}

export interface Category {
  id: number;
  categoryName: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdDate: string; // ISO string for Date
  updatedDate?: string | null; // ISO string for Date or null
}

export interface CategoryResponse {
  data: Category[];
}