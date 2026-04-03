import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://inventory-management-system-akoi.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
