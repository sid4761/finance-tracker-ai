import axios from "axios";

const API = axios.create({
  baseURL: "https://finance-backend-gfd5.onrender.com/api"
});

export default API;