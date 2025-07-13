import axios from 'axios'
import qs from 'qs'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // 쿠키 자동 포함
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: 'repeat',
      skipNulls: true,
    }),
})

axiosInstance.interceptors.request.use((config) => {
  const atkKey = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY
  const token = atkKey && localStorage.getItem(atkKey)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export default axiosInstance
