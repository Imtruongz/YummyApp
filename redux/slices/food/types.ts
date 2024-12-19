export interface randomFood {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface food {
  id: string;
  name: string;
  ingredients?: string;
  step?: string;
  image?: string;
}
