// GET Requests
export const useAxiosFetch = async (route, options) => {
  const { $axios } = useNuxtApp()
  const res = await $axios.get(route, options)
  return res
}

// POST Requests
export const useAxiosPost = async (route, body, options) => {
  const { $axios } = useNuxtApp()
  const res = await $axios.post(route, body, options)
  return res
}

// DELETE Requests
export const useAxiosDel = async (route, options) => {
  const { $axios } = useNuxtApp()
  const res = await $axios.delete(route, options)
  return res
}