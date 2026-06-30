import axios from 'axios'
import { useAuthStore } from '../store/AuthStore'
// import router from '/src/router/index.js'
import Swal from 'sweetalert2'

export default () => {
  const authStore = useAuthStore()
const projectURL = import.meta.env.VITE_BASE_URL+'/api'
  const instance = axios.create({
    baseURL: projectURL,
    headers: {
      'Content-Type': 'application/json',
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      Authorization: `Bearer ${authStore.token}`,
    },
  })

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Call the logout action

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Your session has expired. Please log in again.",
        });
        setTimeout(() => {
            authStore.logout()
        },3000)
      }
      return Promise.reject(error)
    }
  )

  return instance
}
