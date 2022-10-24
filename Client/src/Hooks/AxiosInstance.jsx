import axios from 'axios';


function AxiosInstance() {

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
  });

  return axiosInstance;
}

export default AxiosInstance;