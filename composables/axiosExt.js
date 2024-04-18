export const useAxiosExtFetch = async (route, options) => {
  const { $axiosExt } = useNuxtApp()
  const res = await $axiosExt.get(route, options)
  return res
}