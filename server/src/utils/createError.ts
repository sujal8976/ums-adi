interface CustomError extends Error {
  status?: number;
}

const createError = (status: number, message: string): CustomError => {
  const error = new Error(message) as CustomError;
  error.status = status;
  return error;
};

export default createError;
