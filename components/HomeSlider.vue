<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import sliderDataJson from "~/utils/site-content/sliderData.json"


// State to hold the fetched data
const sliderData = ref([])

// State to hold the current slide index
const currentIndex = ref(0)

// Computed property to get the current slide data
const currentSlide = computed(() => sliderData.value[activeState.value] || {})
// when the active state is 1 the index would be 1

// Function to fetch the JSON data
const fetchSliderData = async () => {
  try {
    sliderData.value = sliderDataJson
  } catch (error) {
    console.error('Failed to load slider data', error)
  }
}

const activeState = ref(1)

// Function to automatically change the slide every 5 seconds
const startSlider = () => {
  setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % sliderData.value.length
  }, 5000)
}

// Fetch the slider data and start the slider when the component is mounted
onMounted(async () => {
  await fetchSliderData()
  startSlider()
})
</script>

<template>
  <div class="slider">


    <v-sheet class="mx-auto tw-flex tw-flex-col tw-items-center tw-bg-[F585C7]" elevation="4" max-width="1000" >

      <div class=" tw-flex tw-flex-col">
        <div class="slider-title">
          <h2>{{ currentSlide.title }}</h2>
        </div>
  
        <div>
          <p>{{ currentSlide.desc}}</p>
        </div>
      </div>

    <v-slide-group v-model="activeState" class="pa-4" center-active show-arrows>


      <v-slide-group-item  v-for="n in sliderData" :key="n" v-slot="{ isSelected, toggle }">

        <v-card class="ma-4" height="200" :width="isSelected ? 400 : 250 " @click="toggle">
        
          <div>
            <p>{{ n.text}}</p>
          </div>

          <div class="d-flex fill-height tw-z-10 align-center justify-center">
            <v-scale-transition>
                <v-img color="white" :src="n.image" size="50"></v-img>  
            </v-scale-transition>
          </div>

          <div class=" tw-flex tw-justify-between">

            {{n.desc2}}

            <p>Check it out</p>
          </div>

        </v-card>
        
      </v-slide-group-item>
   
    </v-slide-group>

  </v-sheet>

  </div>
</template>

<style scoped>
.slider {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 1000px;
  margin: auto;
}

.slider-title h2 {
  margin-bottom: 20px;
  font-size: 24px;
}

.slider-image img {
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>


  

