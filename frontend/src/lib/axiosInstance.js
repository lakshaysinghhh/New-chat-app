import axios from "axios";

export  const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api", // backend URL
  withCredentials: true, // important for cookies (JWT)
});

