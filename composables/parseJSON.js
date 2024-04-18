export const useParseJSON = (json) => {
  let parsedJSON
  try {
    parsedJSON = JSON.parse(json)
  } catch (error) {
    console.log(error);
  }
  return parsedJSON
}
