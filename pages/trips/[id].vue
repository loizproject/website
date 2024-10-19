<script setup>
import campaignDetails from "~/utils/site-content/individual-campaigns.json"
import { useRoute } from 'vue-router'

const route = useRoute()

// Find the post by matching the id from the route params
const trip = campaignDetails.find(p => p.slug === route.params.id)
console.log(trip);

</script>

<template>
    <main class=" tw-pt-10">

        <div class="tw-bg-white tw-p-8 tw-rounded-md tw-w-[90%] tw-mx-auto">

            <div class=" tw-flex tw-flex-col" >

                <div class=" tw-flex tw-flex-col tw-mt-8">
                    <h3 class=" tw-text-4xl">{{trip.title}}</h3>
                    <p class="tw-my-4">{{trip.desc}}</p>
                    <v-btn class="submit tw-w-[100px]">
                        Book Trip
                    </v-btn>
                    
                </div>


                <div class="horizontal-line tw-mt-8"></div>


                <div class="tw-flex tw-gap-3 tw-items-center tw-mt-8">
                    <h4 class=" tw-text-2xl">More Details</h4>
                    <client-only><iconify-icon icon="iconamoon:arrow-down-6-circle-light" class="tw-text-4xl"></iconify-icon></client-only>
                </div>


                <div class="tw-mt-8 ">
                    <img :src="trip.image " alt="" class=" tw-rounded-md tw-w-[100%] tw-mx-auto">
                </div>

                <div class=" tw-flex tw-items-center tw-justify-center tw-mt-4">
                    <client-only><iconify-icon icon="mdi:naira" class=" tw-text-2xl"></iconify-icon></client-only>
                    <h6 class=" tw-text-3xl tw-font-normal">40000</h6>
                </div>

                <div class=" tw-grid tw-grid-cols-1 tw-w-full md:tw-grid-cols-3 tw-mx-auto tw-gap-3 tw-mt-8">
                    <div v-for="(card, index ) in trip.card_details" :key="index" class="tw-border-2 tw-border-[F585C7] tw-rounded-lg" >
                        <div class="tw-p-2">
                            <img :src="card.imageurl" class="tw-w-full tw-h-60 tw-object-cover tw-rounded-md" alt="campaign image">
                        </div>
                        <p class=" tw-text-center tw-text-lg">{{card.title}}</p>
                    </div>
                </div>

            

                <div class=" tw-flex tw-flex-col tw-mt-8">
                    <p class="tw-font-semibold">Itenary</p>
                    <ul class="styled-list tw-ml-4">
                        <li v-for="(bullet, index ) in trip.itenary" :key="index" class=" tw-flex tw-items-start tw-gap-2">
                            <client-only> <iconify-icon icon="teenyicons:tick-circle-outline" class=" tw-text-xl  tw-mt-1"></iconify-icon> </client-only>
                           <p>{{bullet}}</p>
                        </li>
                    </ul>    
                </div>

                <div class=" tw-mt-8 tw-flex tw-flex-col tw-max-w-[70%] tw-mx-auto ">
                    <div class="horizontal-line"></div>
                    <p class=" tw-font-semibold tw-m-0">{{ trip.includes}}</p>
                    <div class="horizontal-line"></div>
                </div>


                <div class=" tw-mx-auto tw-mt-4">
                    <v-btn class="submit tw-w-[100px]">
                        Book Trip
                    </v-btn>
                    <p>{{trip.icon}}</p>
                </div>


                <div class="tw-mt-8">
                    <img :src="trip.image2 " alt="campaign image" class=" tw-rounded-md"> 
                </div>


                <div class=" tw-flex tw-flex-col tw-mt-8">
                    <p class="tw-font-semibold">Tips for the Tour </p>
                    <ul class="styled-list tw-ml-4">
                        <li v-for="(bullet, index ) in trip.tips" :key="index" class=" tw-flex tw-items-start tw-gap-2">
                            <client-only> <iconify-icon icon="teenyicons:tick-circle-outline" class=" tw-text-xl tw-mt-1"></iconify-icon> </client-only>
                           <p>{{bullet}}</p> 
                        </li>
                    </ul>    
                </div>


                
                <div class=" tw-mt-8 tw-flex tw-flex-col tw-text-center tw-max-w-[95%] tw-mx-auto tw-bg-[#F9DAED] tw-rounded-md">
                    <p class="  tw-mb-0 tw-p-3">{{ trip.cost_includes}}</p>
                </div>
            

                <div class=" tw-flex tw-flex-col tw-pt-8">
                    <p class="tw-font-semibold">Payment Plan/Discount Offers</p>
                    <ul class="styled-list tw-ml-4">
                        <li v-for="(bullet, index ) in trip.payment" :key="index" class=" tw-flex tw-items-start tw-gap-2">
                            <client-only> <iconify-icon icon="teenyicons:tick-circle-outline" class=" tw-text-xl tw-mt-1"></iconify-icon> </client-only>
                           <p>{{bullet}}</p> 
                        </li>
                    </ul>    
                </div>

            

                <v-btn class="submit tw-w-[100px] tw-mt-2">
                    Book Trip
                </v-btn>
                





            </div>




        </div>
        

    </main>
</template>

<style scoped>

.horizontal-line {
    width: 100%; 
    height: 2px; 
    background-color: #CCCCCC;    
    margin: 10px 0; 
  }
  
  .styled-list li {
    font-size: 18px; /* Custom font size for the list items */
    color: #1A1A1A; /* Customize color */
  }

  .styled-list {
    list-style-type: none; /* Remove default bullet */
    padding-left: 0;
  }

.image-hover-effect {
    display: inline-block;
    overflow: hidden; /* Ensures that scaling doesn't overflow the container */
  }

  .image-hover-effect img {
    display: block; /* Ensures no extra space at the bottom */
    width: 100%; /* Ensure image takes up the width of its container */
    transition: transform 0.3s ease; /* Smooth hover transition */
  }

  .image-hover-effect img:hover {
    transform: scale(1.1); /* Scales the image slightly on hover */
    border-radius: 10px;
  }
</style>