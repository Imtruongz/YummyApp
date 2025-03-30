export interface category {
  categoryId: string;
  categoryName: string;
  categoryThumbnail: string;
}

export interface categoryState {
  categoryList: category[];
  isLoadingCategory: boolean;
  isErrorCategory: boolean;
}
