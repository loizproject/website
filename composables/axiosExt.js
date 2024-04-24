export const useAxiosExtFetch = async (route, options) => {
  const { $axiosExt } = useNuxtApp()
  const res = await $axiosExt.get(route, options)
  return res
}

// POST Requests
export const useAxiosExtPost = async (route, body, options) => {
  const { $axiosExt } = useNuxtApp()
  const res = await $axiosExt.post(route, body, options)
  return res
}

// DELETE Requests
export const useAxiosExtDel = async (route, options) => {
  const { $axiosExt } = useNuxtApp()
  const res = await $axiosExt.delete(route, options)
  return res
}