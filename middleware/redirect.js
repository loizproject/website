export default defineNuxtRouteMiddleware((to) => {
  const router = useRouter()
  if (to.fullPath.endsWith('/') && to.fullPath !== '/') {
    router.push(to.fullPath.slice(0, -1));
  }
})
