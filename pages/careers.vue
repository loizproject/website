<script setup>
import careers from "~/utils/site-content/careers.json"
console.log(careers);

</script>

<template>
    <main>

        <section class=" banner  tw-h-[500px] tw-grid tw-place-items-center tw-text-center">

            <div>
               
                <h1 class=" tw-text-6xl tw-text-white">
                    Join The <span class=" blue-text">Loiz Team</span> 
                </h1>
    
                <p class=" tw-text-[20px] tw-text-white tw-my-4 lg:tw-w-2/3 tw-mx-auto">
                    Be part of something big. At Loiz, we value passion, innovation, and growth. Ready to make an impact?
                </p>

                <div class=" tw-flex tw-justify-center tw-mt-4">

                    <v-btn size="x-large" class="submit tw-font-semibold  d-flex align-center py-4">
                        View Open Positions
                        <iconify-icon icon="ion:enter-outline" class=" tw-text-2xl tw-ml-1"></iconify-icon>
                    </v-btn>

                </div>

            </div>
            
        </section>


        <section>

            <v-container>

                <h2 class=" tw-mt-10">
                    Open Positions
                </h2>
                
                <v-card v-for="(item, index) in careers" :key="index" class=" tw-my-10 tw-p-8">

                    <h1 class=" tw-text-3xl">
                        {{ item.title }}
                    </h1>

                    <p class="tw-text-[20px] tw-my-4">
                        {{ item.desc }}
                    </p>

                    <i>
                        {{ item.department }} | {{ item.work_mode }} | {{ item.country }}
                    </i>
 
                    <div>

                        <a :href="item.link" target="_blank" class=" tw-text-[#c40a77] tw-mt-3 tw-flex tw-items-center tw-w-fit hover:tw-opacity-70 tw-duration-300 tw-font-[550]">
                            Apply Now
                            <iconify-icon icon="ep:right" class=" tw-text-2xl tw-ml-1"></iconify-icon>
                        </a>

                    </div>

                </v-card>
                

            </v-container>

        </section>



    </main>
</template>

<style scoped>

.banner{
    background-image: linear-gradient(#00000080, #00000080), url("https://res.cloudinary.com/loiztours/image/upload/v1724276429/careers/DSC_8562.jpg") ;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

}

</style>








