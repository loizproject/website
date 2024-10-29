<template>
  <div>

    <!-- Modal background -->
    <div v-if="isVisible" class="modal-overlay"></div>

    <!-- Modal form -->
    <div v-if="isModalOpen" class="modal">

      <button @click="closeModal" class="tw-absolute tw-top-2 tw-right-2 tw-text-gray-500 tw-hover:text-gray-700">
        <span class="tw-text-2xl">&times;</span>
      </button>

      <div class="modal-content">
        <h2>Vacation Information Form</h2>
        <form @submit.prevent="submitForm">
          
          <!-- Submit and Close buttons -->
          <div class="form-actions">
            <button type="submit">Submit</button>
            <button type="button" @click="closeModal">Close</button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'

// Modal visibility state
const isVisible = ref(false)

// Function to show the modal
const showModal = () => {
  isVisible.value = true;
};

// Expose showModal to the parent so the parent component can trigger it
defineExpose({
  showModal,
});

// Function to close the modal
const closeModal = () => {
  isVisible.value = false;
};

// Props to control modal visibility
const props = defineProps({
  isModalOpen: Boolean
})

// Emit events to parent
const emit = defineEmits(['close-modal'])

// Form data state
const formData = ref({
  title: '',
  firstName: '',
  middleName: '',
  surname: '',
  email: '',
  whatsapp: '',
  age: '',
  gender: '',
  country: '',
  vacationDate: ''
})

const submitForm = () => {
  // Process the form data (e.g., submit to an API)
  console.log(formData.value)

  // Emit close event after form submission
  emit('close-modal')
}
</script>

<style scoped>
/* Styles remain the same as in the previous version */
</style>

