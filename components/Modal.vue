<template>
  <div
    v-if="showSecurityModal"
    class="tw-fixed tw-inset-0 tw-bg-gray-900 tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50"
    @click.self="closeModal"
  >
    <!-- Modal content -->
    <div
      class="tw-bg-white tw-rounded-lg tw-p-6 tw-w-full tw-max-w-md tw-shadow-lg tw-relative"
    >
      <!-- Modal header -->
      <p class="tw-text-4xl tw-font-semibold tw-mb-4 tw-text-center">
        Welcome to Our Website!
      </p>

      <!-- Modal body -->
      <p class="tw-text-gray-700 tw-mb-6 tw-text-center">
        Please note: Loiztravels.com is our official website. Always verify the
        URL before entering payment details or any other sensitive information.
        Thank you
      </p>

      <!-- Call-to-action button -->
      <div class="tw-text-center">
        <button
          @click="closeModal"
          class="tw-bg-indigo-500 tw-text-white tw-px-4 py-2 tw-rounded-md tw-hover:bg-indigo-600 tw-transition"
        >
          Enjoy your session
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "~/store";

// Modal visibility state
const store = useStore();
const showSecurityModal = ref(false);

// Function to show the modal
const showModal = () => {
  const securityCheck = useGetCookie("security_notice");
  if (securityCheck) {
    showSecurityModal.value = false;
    store.setCookies(true);
    return;
  }
  showSecurityModal.value = true;
  store.setCookies(true);
};

// Function to close the modal
const closeModal = () => {
  useSetCookie("security_notice", "1", 42);
  showSecurityModal.value = false;
  store.setCookies(true);
};

// Expose showModal to the parent so the parent component can trigger it
defineExpose({
  showModal,
});
</script>

<style scoped>
/* Modal styling */
</style>
