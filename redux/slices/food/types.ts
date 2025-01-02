import {WritableDraft} from 'immer';

interface food {
  foodId?: string;
  foodName?: string;
  categoryId?: string;
  userId?: string;
  foodDescription?: string;
  foodIngredient?: string;
  foodThumbnail?: string;
  foodSteps?: string;
  created_at?: string;
  updated_at?: string;
  userDetail?: {
    userId?: string;
    username?: string;
    email?: string;
    avatar?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface foodState {
  foodList: WritableDraft<food>[]; // Danh sách món ăn
  selectedFood: WritableDraft<food> | null; // Món ăn chi tiết
  isLoadingFood: boolean;
  isErrorFood: boolean;
}

export type {food};
