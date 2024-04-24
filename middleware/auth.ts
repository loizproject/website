export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useCookie("loiz_auth_token")
  if (!auth.value) {
    const router = useRouter()
    const rdr = useCookie("loiz_redirect")
    rdr.value = to.fullPath
    router.push(`/auth/login`)
  }
})
