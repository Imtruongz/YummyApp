export interface category {
  categoryId?: string;
  categoryName?: string;
  categoryThumbnail?: string;
}

export interface categoryState {
  categoryList: category[] | null;
  isLoadingCategory: boolean;
  isErrorCategory: boolean;
}
