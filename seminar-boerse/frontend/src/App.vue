<script setup lang="ts">
import TopNav from "./components/TopNav.vue";
import keycloak from "./keycloak";
console.log(keycloak.token);
</script>

<template>
  <div
    class="w-screen h-screen max-h-full overflow-hidden flex justify-start items-center flex-col"
  >
    <TopNav />
    <router-view />
  </div>
</template>
