import { defineNuxtPlugin } from '#app'
import axios from 'axios'

export default defineNuxtPlugin((app) => {
  const config = useRuntimeConfig()
  // Create Axios instance
  const instance = axios.create({
    baseURL: config.public.BASE_URL,
    headers: {
      common: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  });

  // Set defaults
  instance.defaults.baseURL = config.public.BASE_URL,
  
  // Provide the instance to the application
  app.provide('axios', instance)
})
