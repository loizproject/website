<template>
  <div class="latest-trips">
    <h2 class="section-title">Latest Trips</h2>
    <p class="section-subtitle">
      Are you ready to embark on an unforgettable journey of
      <strong>self-discovery, adventure, and freedom?</strong>
    </p>
    <swiper
      :modules="[Navigation, Pagination]"
      :slides-per-view="1"
      :space-between="20"
      :loop="true"
      navigation
      pagination
      class="latest-trips-slider"
    >
      <swiper-slide v-for="(trip, index) in trips" :key="index">
        <div class="trip-card">
          <h3 class="trip-title">{{ trip.title }}</h3>
          <img :src="trip.image" :alt="trip.title" class="trip-image" />
          <p class="trip-description">{{ trip.description }}</p>
          <div class="trip-tags">
            <span v-for="(tag, idx) in trip.tags" :key="idx" class="tag">{{
              tag
            }}</span>
          </div>
          <button class="check-out-button">Check it out →</button>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { Navigation, Pagination } from "swiper/modules";
import { ref } from "vue";

// Import Swiper modules for Composition API setup
const modules = [Navigation, Pagination];

// Trip data
const trips = ref([
  {
    title: "Solo Trip",
    image: "https://via.placeholder.com/800x400?text=Solo+Trip",
    description:
      "Discover the World on Your Terms With Loiz Tours & Solo Trip Package.",
    tags: ["Spain", "London", "+2 others"],
  },
  {
    title: "Trip for Two",
    image: "https://via.placeholder.com/800x400?text=Trip+for+Two",
    description: "Experience the timeless charm of shared adventures.",
    tags: ["Paris", "Venice"],
  },
  // Add more trips here
]);
</script>

<style scoped>
.latest-trips {
  text-align: center;
  padding: 2rem 1rem;
  background: #f9f9f9;
}

.section-title {
  color: #e05aa5;
  font-size: clamp(1.5rem, 5vw, 2rem);
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #555;
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

.latest-trips-slider {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.trip-card {
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  margin: 0 0.5rem;
}

.trip-title {
  color: #333;
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  margin-bottom: 0.5rem;
}

.trip-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
  max-height: 200px;
  object-fit: cover;
}

.trip-description {
  font-size: clamp(0.9rem, 3vw, 1rem);
  color: #555;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
}

.trip-tags {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tag {
  background: #f0f0f0;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  color: #777;
  font-size: clamp(0.8rem, 3vw, 0.9rem);
  white-space: nowrap;
}

.check-out-button {
  background: #e05aa5;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: clamp(0.8rem, 3vw, 0.9rem);
  margin-top: 0.5rem;
}

.check-out-button:hover {
  background: #d04a92;
}

/* Mobile-specific adjustments */
@media (max-width: 480px) {
  .latest-trips {
    padding: 1.5rem 0.5rem;
  }

  .trip-card {
    padding: 0.8rem;
  }

  .trip-image {
    max-height: 180px;
  }
}
</style>