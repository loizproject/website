import { useStore } from "~/store";

export const useCopyText = (text) => {
  const store = useStore()
  if (navigator.clipboard) {
    try {
      navigator.clipboard.writeText(text);
      store.setToast("Copied Succesfully", { type: "success" });
    } catch (error) {
      store.setToast("Couldn't copy text. Please try again", { type: "error" });
    }
  }
}