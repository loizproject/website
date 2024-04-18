// import { useStore } from "~/store";
export const useErrorHandler = async (error, options) => {
  // const store = useStore()
  console.log(error, error.response, options);
  // if (error.response && error.response.status >= 500) {
  //   $toast.error("Oops! An error occoured in our server. Please try again.")
  // }
  // else if (error.response && error.response.status === 404) {
  //   $toast.error(`Not Found. ${error.response ? error.response.data.message : error.message}`);
  // }
  // else {
  //   if (error.response.data.errors) {
  //     Object.values(error.response.data.errors).forEach((val) =>
  //       $toast.error(val)
  //     );
  //   }
  //   else if (error.response.data.error) {
  //     $toast.error(error.response.data.error.message)
  //   }
  //   else {
  //     $toast.error(`${error.response ? error.response.data.message : error.message}`);
  //   }
  // }
}
