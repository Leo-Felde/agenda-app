import axios from 'axios'

const AppURL = 'https://demometaway.vps-kinghost.net:8485/api'

const storedUser = JSON.parse(localStorage.getItem('userData'))
const token = storedUser?.accessToken

const createAPI = (routeURL, responseType = 'json') => {
  const baseURL = AppURL + routeURL
  const headers = routeURL !== '/auth'
    ? { Authorization: `Bearer ${token}` }
    : {}

  const api = axios.create({
    baseURL,
    headers,
    responseType,
  })

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        localStorage.removeItem('userData')
        return navigateTo('/auth')
      }
      return Promise.reject(error)
    }
  )

  return api
}

export default createAPI
