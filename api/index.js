import axios from 'axios'
const AppURL = 'https://demometaway.vps-kinghost.net:8485/api'

const storedUser = JSON.parse(localStorage.getItem('userData'))
const token = storedUser?.accessToken

const createAPI = (routeURL) => {
  const baseURL  = AppURL + routeURL
  const headers = routeURL !== '/auth'
    ? { Authorization: `Bearer ${token}` }
    : {}

  const api = axios.create({
    baseURL,
    headers
  })

  return api
}

export default createAPI