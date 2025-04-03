<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps([
  "sliderTrips"
]);

const slides = ref([])
const currentIndex = ref(0)


// Fetch data from the JSON file
const fetchSlides = async () => {
  try {
    slides.value = props.sliderTrips
  } catch (error) {
    console.error('Failed to load slider data', error)
  }
}

// Auto-slide functionality
const startAutoSlide = () => {
  setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % slides.value.length
  }, 5000) // Slide every 5 seconds
}


const goToSlide = (index) => {
  currentIndex.value = index
}

onMounted(() => {
  fetchSlides()
  startAutoSlide()
})
</script>


<template>

  <main class="slider-container">

    <div class="slider" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      
      <div v-for="(slide, index) in slides" :key="index" class="slide" 
        :style="{ backgroundImage: `url(${slide.image})` }">
          <div class="slide-content">
            <p class=" tw-text-[32px]">{{ slide.title }}</p>
            <p class=" tw-text-md">{{ slide.desc}}</p>
            <v-btn :to="`/trips/${slide.slug}`" class=" submit tw-rounded-lg">
              Book Now
            </v-btn>
          </div>
      </div>

    </div>

    <!-- <div class="arrow tw-flex ">
      <iconify-icon icon="icon-park-solid:arrow-circle-left" @click="prevSlide"></iconify-icon>
      <iconify-icon icon="icon-park-solid:arrow-circle-right" @click="nextSlide" ></iconify-icon>
    </div> -->

    <!-- Slider Navigation Circles -->
    <div class="circles">
      <span v-for="(slide, index) in slides" :key="index" :class="['circle', { active: currentIndex === index }]" @click="goToSlide(index)"></span>
    </div>

  </main>
</template>


<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.slider {
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 100%;
}

.slide {
  min-width: 100%;
  height: 75vh; 
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  color: white;
}

.slide-content {
  background: rgba(0, 0, 0, 0.5); /* Dark overlay */
  padding: 20px;
  border-radius: 10px;
  margin: 0 50px;
  max-width: 500px;
}

.circles {
  position: absolute;
  bottom: 20px;
  left: 50px;
  display: flex;
  gap: 10px;
}

.circle {
  width: 15px;
  height: 15px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #645E61;
}

.circle.active {
  background-color: #F9DAED;
}
</style>
