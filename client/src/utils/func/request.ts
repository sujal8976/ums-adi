import axios from "axios";

const backEndPort = import.meta.env.VITE_BACK_END_PORT;
const newRequest = axios.create({
  baseURL: `${backEndPort}/api/`,
  withCredentials: true,
});

export default newRequest;
