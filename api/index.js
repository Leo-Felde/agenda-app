import axios from 'axios'
const AppURL = 'https://demometaway.vps-kinghost.net:8485/'

const createAPI = (routeURL) => {
  const baseURL  = AppURL + routeURL
  const api = axios.create({
    baseURL 
  })

  return api
}

export default createAPI