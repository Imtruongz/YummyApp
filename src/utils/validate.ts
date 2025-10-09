import { isValidEmail, isValidPassword } from './regexPatterns';

export const verifyEmail = (email: string) => {
  return isValidEmail(email);
};

export const verifyPassword = (password: string) => {
  return isValidPassword(password);
};

export const verifyConfirmPassword = (
  password: string,
  confirmPassword: string,
) => {
  if (password === confirmPassword) {
    return true;
  } else {
    return false;
  }
};

export const verifyCookingTime = (cookingTime: number) => {
  return cookingTime > 0;
};
