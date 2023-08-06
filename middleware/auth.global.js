export default defineNuxtRouteMiddleware((to) => {
  const storedToken = localStorage.getItem('token')
  const authenticated = useAuthToken()

  if (!authenticated.value && storedToken) {
    authenticated.value = storedToken
  }

  const isAuthPage = to.fullPath.includes('/auth')
  if (!authenticated.value && !isAuthPage) {
    console.log('roteamento para o login')
    return navigateTo('/auth')
  } else {
    console.log('roteamento normal')
    return
  }
})