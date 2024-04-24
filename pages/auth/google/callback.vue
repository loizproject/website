@@ -1,31 +0,0 @@
<template>
  <div class="google d-flex align-center justify-center">
    <img src="/svg/loading.svg" alt="" />
  </div>
</template>

<script setup>
import { useStore } from "~/store";
import { useAuthStore } from "~/store/auth";

const store = useStore();
const authStore = useAuthStore();
const router = useRouter();

const rdr = useCookie("loiz_redirect");

const googleAuth = async () => {
  try {
    await authStore.googleAuth();
    await authStore.fetchUser();
    rdr.value ? router.push(rdr.value) : router.push("/");
    rdr.value = null; // delete redirect path after action has been done
  } catch (error) {
    useErrorHandler(error);
  }
};

onMounted(async () => {
  await googleAuth();
});
</script>

<style lang="scss" scoped>
.google {
  min-height: 60vh;
  & img {
    width: 120px;
  }
}
</style>
