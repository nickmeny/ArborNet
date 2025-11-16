import axios from "axios";

axios.defaults.withCredentials = true;

export default axios.create({
<<<<<<< HEAD
  baseURL: "http://172.31.171.181:5000"
=======
  baseURL: "172.29.84.3:5000"
>>>>>>> newbranch
});