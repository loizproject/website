export default defineNuxtRouteMiddleware((to, from) => {
  if(process.client) {
    const auth = useCookie("loiz_auth_token")
    if (auth.value) {
      const router = useRouter()
      router.push(from.fullPath)
    }
  }
})