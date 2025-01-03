import {WritableDraft} from 'immer';

interface food {
  foodId: string;
  foodName: string;
  categoryId?: string;
  userId?: string;
  foodDescription?: string;
  foodIngredients?: string;
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

export interface foodPayload {
  foodName?: string;
  categoryId?: string;
  userId?: string;
  foodDescription?: string;
  foodIngredients?: string;
  foodThumbnail?: string;
  foodSteps?: string;
}

export interface foodState {
  foodList: WritableDraft<food>[];
  userFoodList: food[];
  categoryFoodList: food[];
  selectedFood: WritableDraft<food> | null;
  isLoadingFood: boolean;
  isErrorFood: boolean;
}

export type {food};
