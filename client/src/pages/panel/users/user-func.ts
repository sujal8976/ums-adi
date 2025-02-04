export const generateUsername = (firstName: string) => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
  return `${firstName}${randomDigits}`;
};

export const generatePassword = () => {
  return Math.random().toString(36).slice(-8); // Generates random 8-char password
};
