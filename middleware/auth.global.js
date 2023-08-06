export default defineNuxtRouteMiddleware((to) => {
  const storedToken = localStorage.getItem('token')
  const authenticated = useAuthToken()

  if (!authenticated.value && storedToken) {
    authenticated.value = storedToken
  }

  const isAuthPage = to.fullPath.includes('/auth')
  if (!authenticated.value && !isAuthPage) {
    return navigateTo('/auth')
  }
  
  return
})