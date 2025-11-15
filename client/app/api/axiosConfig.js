import axios from "axios";

axios.defaults.withCredentials = true;

export default axios.create({
  baseURL: "http://172.21.233.166:5000"
});