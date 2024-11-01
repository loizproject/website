<template>
    <div class="tw-relative">
      <div
        class="tw-flex tw-justify-between tw-items-center tw-bg-[#FEF3F9] tw-p-4 tw-rounded-2xl cursor-pointer"
        @click="toggleDropdown"
      >
        <div>{{ title }}</div>
        <span class="tw-transition tw-transform" :class="{'tw-rotate-180': isOpen}">
          ▼
        </span>
      </div>
      <div v-if="isOpen" class="dropdown-menu">
        <div class="tw-p-2 tw-font-semibold">{{ optionsTitle }}</div>
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    optionsTitle: {
      type: String,
      default: 'Options', // Default title for options
    },
  });
  
  const isOpen = ref(false);
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };
  </script>
  
  <style scoped>
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #fff; /* Background color for dropdown */
    border: 1px solid #f5c6cb; /* Border color */
    border-radius: 0.5rem; /* Rounded corners */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Shadow effect */
    z-index: 10; /* Ensures dropdown is above other elements */
    margin-top: 0.5rem; /* Spacing between button and dropdown */
    opacity: 0; /* Initial state hidden */
    transition: opacity 0.3s ease; /* Transition for smooth opening */
    visibility: hidden; /* Keeps dropdown hidden when not visible */
  }
  
  .dropdown-menu[v-cloak] {
    opacity: 1;
    visibility: visible; /* Show dropdown when isOpen is true */
  }
  
  .dropdown-menu > * {
    padding: 0.5rem 1rem; /* Padding for dropdown items */
    cursor: pointer; /* Pointer on hover */
  }
  
  .dropdown-menu > *:hover {
    background-color: #f8d7da; /* Background color on hover */
  }
  </style>
  