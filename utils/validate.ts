export const verifyEmail = (email: string) => {
  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const verifyPassword = (password: string) => {
  return password.length > 6;
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
