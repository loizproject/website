<script setup>
const error = useError();
const config = useRuntimeConfig();
const isProduction = config.public.APP_ENV === "production";
</script>

<template>
  <NuxtLayout>
    <div class="error-sect text-center my-10">
      <div>
        <h1 class="tw-text-4xl">Oops! An error occoured</h1>
        <p>It looks like something broke. Sorry about that.</p>
        <p>
          <strong>({{ error.statusCode }}) {{ error.message }}</strong>
        </p>
        <nuxt-link to="/" class="action__btn action__btn--register">
          Back Home
        </nuxt-link>
        <div v-if="!isProduction && error.stack" class="text-left">
          <h1 class="tw-text-xl mb-2">Trace:</h1>
          <div v-html="error.stack" class="error-trace"></div>
        </div>
        <div v-else class="text-left">
          <h1 class="tw-text-xl mb-2">Error Details:</h1>
          <div class="error-trace">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.error-sect {
  min-height: 50vh;
  display: grid;
  place-items: center;
}

.error-trace {
  background-color: #000;
  color: #fff;
  height: 500px;
  width: 90vw;
  margin-left: auto;
  margin-right: auto;
  overflow-x: scroll;
  overflow-y: scroll;
  padding: 10px;
  border-radius: 8px;
}

.action {
  &__btn {
    padding: 7px 24px;
    border-radius: 16px;
    border: 1px solid #c40a77;
    font-size: 0.9rem;
    color: #c40a77;

    &--register {
      padding: 8px 24px;
      background-image: linear-gradient(to right, #02aace, #c40a77);
      border: none;
      color: #fff;
    }
  }
}
</style>
