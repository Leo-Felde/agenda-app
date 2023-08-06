export default defineNuxtRouteMiddleware((to) => {
  const storedUser = JSON.parse(localStorage.getItem('userData'))
  const user = useCurrentUser()

  if (!user?.value && storedUser) {
    user.value = storedUser
  }

  const isAuthPage = to.fullPath.includes('/auth')
  if (!user.value?.accessToken && !isAuthPage) {
    return navigateTo('/auth')
  }


  return
})