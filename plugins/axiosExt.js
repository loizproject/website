import { defineNuxtPlugin } from '#app'
import axios from 'axios'

export default defineNuxtPlugin((app) => {
  const config = useRuntimeConfig()
  // Create Axios instance
  const instance = axios.create({
    headers: {
      common: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  });
  
  // Provide the instance to the application
  app.provide('axiosExt', instance)
})
