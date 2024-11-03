<script setup>

//Script for the cnpards
import { ref, onMounted } from 'vue'
import { formatDate } from '~/utils/lib';
// Fetch card data from the JSON file  
const fetchCardData = async () => {
  try {
    cardsData = trips
  } catch (error) {
    console.error('Failed to load slider data', error)
  }
}

// Fetch the data when the component is mounted
onMounted(fetchCardData)
//Fetching the api
const {data: apires} = await useAxiosFetch(`/trips`)
const trips = apires.data.trips
console.log(trips);
//for the search
const search = ref("");
const currentShowingCards = computed(() => {
  let res = [];
  trips.forEach((item) => {
    if (
      item.title?.toUpperCase().includes(search.value?.toUpperCase()) ||
      item.text?.toUpperCase().includes(search.value?.toUpperCase())||
      item.location?.toUpperCase().includes(search.value?.toUpperCase())||
      item.date?.toUpperCase().includes(search.value?.toUpperCase())
    ) {
      res.push(item);
    }
  });
  return search.value ? res : trips;
});

const banner = (images) => images.find((image) => image.type === "banner")




</script>

<template>

    <main>

        <div>
            <Slider />
        </div>

        <section class=" max-w-[90%] tw-items-center tw-bg-[F9DAED] tw-flex tw-flex-col tw-justify-center">

            <div class=" tw-flex tw-flex-col pt-10 ">
                <h3 class=" tw-text-4xl tw-flex">Our Latest Trips</h3>
                <div class="horizontal-line"></div>
            </div>

           
            
            <div class=" tw-bg-white tw-p-8 tw-rounded-md tw-w-[90%]">

                <div class="tw-flex tw-items-center tw-justify-between tw-w-full"> 
                    <div class=" filter">
                         this is for filtering
                    </div>
    
    
                    <div class="lg:tw-w-1/4">
                        <v-text-field
                          v-model="search"
                          variant="outlined"
                          flat
                          clearable
                          placeholder="Search for a campaign"
                          prepend-inner-icon="mdi-magnify"
                          density="comfortable">
                        </v-text-field>
                      </div>
                </div>
                


                <div class="  card-container tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
                  
                    <div v-for="(card, index) in currentShowingCards" :key="index" class="card">
                      <div class="image-hover-effect">
                        <img :src="banner(card.images).url" :alt="card.title" class="card-image tw-h-[200px] md:tw-h-[300px] tw-w-[100%] " />
                      </div>
                        <div class=" tw-flex tw-justify-between tw-items-center">
                          <h4 class="card-title tw-text-left tw-font-semibold tw-max-w-[70%] ">{{ card.title }}</h4>
                          <div class=" tw-gap-2 tw-flex tw-items-center">
                            <client-only>
                                <iconify-icon icon="oui:token-date" class="tw-text-2xl tw-text-black"></iconify-icon>
                              </client-only>
                            <span class=" card-title tw-text-sm">{{formatDate(new Date(card.startDate))}} - {{formatDate(new Date(card.endDate))}}</span>
                          </div>
                        </div>
                        <p class="card-text tw-font-normal tw-text-left">{{ card.caption }}</p>
                        <div class=" tw-flex tw-flex-row tw-justify-between tw-text-left">
                            <div class=" tw-flex tw-items-center tw-gap-3">
                              <client-only>
                                <iconify-icon v-show="card.type==='domestic' " icon="bxs:train" class=" tw-border-2 tw-p-2 tw-bg-gradient-to-r from-pink-800 via-red-700 to-yellow-700 tw-rounded-full tw-text-2xl tw-text-black"></iconify-icon>
                                <iconify-icon v-show="card.type==='foreign' " icon="bxs:plane-alt" class=" tw-border-2 tw-p-2 tw-bg-gradient-to-r from-pink-800 via-red-700 to-yellow-700 tw-rounded-full tw-text-2xl tw-text-black"></iconify-icon>
                              </client-only>
                              <div class=" tw-flex tw-gap-2 tw-py-2 tw-px-4 tw-bg-[#D0EEF5] tw-rounded-2xl">
                                <span v-for="location in card.locations" class=" tw-m-0">{{location.city}}</span>
                              </div>
                            </div>

                            
                              <v-btn :to="`/trips/${card.slug}`" class=" submit" elevation="0">
                                See details
                              </v-btn>
                            
                            
                        </div>
                    </div>

                </div>

            </div>


        </section>
        
      

    </main>
                 
                
</template>

<style scoped>
.horizontal-line {
  width: 100%; /* Full-width line */
  height: 2px; /* Line thickness */
  background-color: #CCCCCC; /* Line color */
  margin: 20px 0; /* Optional spacing */
}

.card-container {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-top: 20px; 
  }
  
  .card {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    border: 1px solid #CCCCCC; 

  }
  
  .card-image {
    object-fit: cover;
    border-radius: 8px 8px 8px 8px;  
  }
  
  
  .card-title {
    font-size: 18px;
    margin: 15px 0;
  }
  
  .card-text {
    font-size: 16px;
    color: #1A1A1A;
  }
.plane{
  border: 1px solid;
  border-radius: 50%;
  padding: 6px;
  text-align: center;
}

.see-details{
  border: 1px solid black;
  padding: 6px;
  border-radius: 10px
}

.image-hover-effect {
  overflow: hidden; /* Ensures that scaling doesn't overflow the container */
}

.image-hover-effect img {
  display: block; /* Ensures no extra space at the bottom */
  width: 100%; /* Ensure image takes up the width of its container */
  transition: transform 0.3s ease; /* Smooth hover transition */
}

.image-hover-effect img:hover {
  transform: scale(1.1); /* Scales the image slightly on hover */
}
 

</style>








