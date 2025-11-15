import axios from "axios";

axios.defaults.withCredentials = true;

export default axios.create({
  baseURL: "http://172.29.84.3:5000"
});