// src/api/axios.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

// set baseURL globally
axios.defaults.baseURL = baseURL;

// optional: set default headers
axios.defaults.headers.common['Content-Type'] = 'application/json';

// now you can still import axios normally anywhere
export default axios;
