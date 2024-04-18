import lodash from "lodash"

export const useGetSlug = (text) => {
    // console.log(text, lodash);
    let slug
    try {
      slug = lodash.kebabCase(text)
    } catch (error) {
      console.log(error);
    }
    return slug
  }
