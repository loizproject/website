import { useStore } from "~/store"

// GET REQUESTS
export const useLoizFetch = (request: string, opts?: ObjectDefault) => {
  const config = useRuntimeConfig()
  const store = useStore()

  // const authToken = useGetCookie('auth_token')
  const options: any = {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    baseURL: opts?.baseURL ? opts.baseURL : config.public.API_URL,
    watch: false,
    ...opts,
  }
  // if (authToken) {
  //   options.headers['Authorization'] = `Bearer ${authToken}`;
  // }
  if (process.client && !window?.navigator?.onLine) { // Custom response if user isn't connected to network
    setTimeout(() => {
      const toastMeta: ToastMeta = {
        icon: "$error",
        type: "error",
      };
      store.setToast("Please check your network connection", toastMeta)
    }, 200);
  }
  return useFetch(request, options)
}

// POST REQUESTS
export const usePost = (request: string, body: ObjectDefault, opts?: ObjectDefault) => { // POST requests
  const config = useRuntimeConfig()
  const store = useStore()
  // const authToken = useGetCookie('auth_token')

  const options: any = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": opts?.headers && opts?.headers["Content-Type"] ? opts?.headers["Content-Type"] : "application/json",
    },
    baseURL: opts?.baseURL ? opts.baseURL : config.public.API_URL,
    watch: false,
    // ...opts,
    body
  }
  // if (authToken) {
  //   options.headers['Authorization'] = `Bearer ${authToken}`;
  // }
  if (opts?.formData) {
    delete options?.headers["Content-Type"]
  }
  if (process.client && !window?.navigator?.onLine) { // Custom response if user isn't connected to network
    setTimeout(() => {
      const toastMeta: ToastMeta = {
        icon: "$error",
        type: "error",
      };
      store.setToast("Please check your network connection", toastMeta)
    }, 200);
  }
  return useFetch(request, options)
}

// PUT REQUESTS
export const usePut = (request: string, body: ObjectDefault, opts?: ObjectDefault) => { // PUT requests
  const config = useRuntimeConfig()
  const store = useStore()
  // const authToken = useGetCookie('auth_token')

  const options: any = {
    method: "PUT",
    headers: {
      "Accept": "application/json",
      "Content-Type": opts?.headers && opts?.headers["Content-Type"] ? opts?.headers["Content-Type"] : "application/json",
    },
    baseURL: opts?.baseURL ? opts.baseURL : config.public.API_URL,
    watch: false,
    // ...opts,
    body
  }
  // if (authToken) {
  //   options.headers['Authorization'] = `Bearer ${authToken}`;
  // }
  if (process.client && !window?.navigator?.onLine) { // Custom response if user isn't connected to network
    setTimeout(() => {
      const toastMeta: ToastMeta = {
        icon: "$error",
        type: "error",
      };
      store.setToast("Please check your network connection", toastMeta)
    }, 200);
  }
  return useFetch(request, options)
}
