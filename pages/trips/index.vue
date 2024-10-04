<script setup>

//Script for the cards
import { ref, onMounted } from 'vue'
import cardsJson from "~/utils/site-content/card.json"

  const cardsData = ref([])
  
  // Fetch card data from the JSON file  
  const fetchCardData = async () => {
  try {
    cardsData.value = cardsJson
  } catch (error) {
    console.error('Failed to load slider data', error)
  }
}
  // Fetch the data when the component is mounted
  onMounted(fetchCardData)



//for the search
const search = ref("");

const currentShowingCards = computed(() => {
  let res = [];
  cardsJson.forEach((item) => {
    if (
      item.title?.toUpperCase().includes(search.value?.toUpperCase()) ||
      item.text?.toUpperCase().includes(search.value?.toUpperCase())||
      item.location?.toUpperCase().includes(search.value?.toUpperCase())
    ) {
      res.push(item);
    }
  });
  return search.value ? res : cardsJson;
});

</script>

<template>

    <main>

        <div>
            <Slider />
        </div>

        <section class=" tw-mx- max-w-[80%] tw-items-center tw-bg-[F9DAED] tw-flex tw-flex-col tw-justify-center">

            <div class=" tw-flex tw-flex-col pt-10 ">
                <h3 class=" tw-text-4xl tw-flex">Our Latest Trips</h3>
                <div class="horizontal-line"></div>
            </div>

           
            
            <div class=" tw-bg-white tw-p-8 tw-rounded-md tw-w-4/5">

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
                        <img :src="card.image" :alt="card.title" class="card-image" />
                        <h4 class="card-title tw-text-left tw-font-semibold ">{{ card.title }}</h4>
                        <p class="card-text tw-font-normal tw-text-left">{{ card.text }}</p>
                        <div class=" tw-flex tw-flex-row tw-justify-between tw-text-left">
                            <div class=" tw-flex tw-items-center tw-gap-3">
                              <iconify-icon icon="bxs:plane-alt" class=" plane tw-text-lg tw-text-[#EB0C8F]"></iconify-icon>
                              <p class=" tw-m-0">{{card.location}}</p>
                            </div>
                            <div>
                              <nuxt-link to="">
                                See details
                              </nuxt-link> 
                            </div>
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
  background-color: #EB0C8F; /* Line color */
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
    border: 1px solid #CCCCCC; ;

  }
  
  .card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px 8px 8px 8px;
    
  }
  
  .card-title {
    font-size: 20px;
    margin: 15px 0;
  }
  
  .card-text {
    font-size: 16px;
    color: #1A1A1A;
  }
.plane{
  border: 1px solid #EB0C8F;
  background-color: #fff;
  border-radius: 999px;
  padding: 6px;
  text-align: center;
}
</style>








