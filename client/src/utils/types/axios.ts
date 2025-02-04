import { AxiosError } from "axios";

// Define the structure of your custom data
interface CustomResponseData {
  error?: string; // Optional, as not all responses may include an error
}

// Extend AxiosResponse to include the custom data type
export interface CustomAxiosError<T = CustomResponseData>
  extends AxiosError<T> {}
