// GET Requests
export const useAxiosFetch = async (route, options) => {
  const { $axios } = useNuxtApp()
  const authToken = useCookie("loiz_auth_token")
  $axios.defaults.headers.common["Authorization"] = `Bearer ${authToken.value}`
  const res = await $axios.get(route, options)
  return res
}

// POST Requests
export const useAxiosPost = async (route, body, options) => {
  const { $axios } = useNuxtApp()
  const authToken = useCookie("loiz_auth_token")
  $axios.defaults.headers.common["Authorization"] = `Bearer ${authToken.value}`
  const res = await $axios.post(route, body, options)
  return res
}

// PUT Requests
export const useAxiosPut = async (route, body, options) => {
  const { $axios } = useNuxtApp()
  const authToken = useCookie("loiz_auth_token")
  $axios.defaults.headers.common["Authorization"] = `Bearer ${authToken.value}`
  const res = await $axios.put(route, body, options)
  return res
}

// DELETE Requests
export const useAxiosDel = async (route, options) => {
  const { $axios } = useNuxtApp()
  const authToken = useCookie("loiz_auth_token")
  $axios.defaults.headers.common["Authorization"] = `Bearer ${authToken.value}`
  const res = await $axios.delete(route, options)
  return res
}