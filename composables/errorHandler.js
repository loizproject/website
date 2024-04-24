import { useStore } from "~/store";

export const useErrorHandler = async (error, options) => {
  const store = useStore()
  console.log(error, error.response, options);
  if (error.response && error.response.status >= 500) {
    store.setToast("Oops! An error occoured in our server. Please try again.", { type: "error" })
  }
  else if (error.response && error.response.status === 404) {
    store.setToast(`Not Found. ${error.response ? error.response.data.message : error.message}`, { type: "error" })
  }
  else {
    if (error.response.data.errors) {
      Object.values(error.response.data.errors).forEach((val) =>
        store.setToast(val, { type: "error" })
      );
    }
    else if (error.response.data.error) {
      store.setToast(error.response.data.error.message, { type: "error" })
    }
    else {
      store.setToast(`${error.response ? error.response.data.message : error.message}`, { type: "error" })
    }
  }
}
