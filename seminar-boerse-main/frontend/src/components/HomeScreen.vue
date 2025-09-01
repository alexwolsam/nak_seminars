<script setup lang="ts">
import { computed, ref } from "vue";
import keycloak from "@/keycloak";
import { BellAlertIcon } from "@heroicons/vue/24/outline";
const notifications = ref([
  { id: 1, message: "Neues Seminar" },
  { id: 2, message: "Dein Seminar 'Vue.js Grundlagen' wurde übernommen" },
]);

const userProfile = ref<any>(null);
keycloak.loadUserProfile().then((profile) => {
  userProfile.value = profile;
});

const userFirstName = computed(() => {
  if (userProfile.value && userProfile.value.firstName) {
    return (
      userProfile.value.firstName.charAt(0).toUpperCase() +
      userProfile.value.firstName.slice(1).toLowerCase()
    );
  }
  return "";
});
</script>
<template>
  <div class="h-full w-3/5 px-5">
    <h1 class="w-full text-center text-3xl font-bold mb-4">
      Hallo
      {{ userFirstName }}!
    </h1>
    <div class="w-full border-1 rounded-md border-gray-300 p-4">
      <h2
        class="font-semibold text-xl mb-2 flex items-center justify-start gap-4 bg-white -translate-y-7 w-fit px-4"
      >
        <BellAlertIcon class="size-6" /> Benachrichtigungen
      </h2>
      <ul v-if="notifications.length !== 0" class="text-gray-800">
        <li
          v-for="notification in notifications"
          :key="notification.id"
          class="not-last:border-b-1 border-gray-300 py-2 rounded-md hover:bg-gray-200 px-2"
        >
          {{ notification.message }}
        </li>
      </ul>
      <p v-else class="text-gray-500 w-full text-center">
        - Keine neuen Benachrichtigungen -
      </p>
    </div>
  </div>
</template>
