import axios from "axios";

axios.defaults.withCredentials = true;

export default axios.create({
  baseURL: "http://172.31.171.181:5000"
});