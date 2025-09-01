<script setup lang="ts">
import {
  Bars3Icon,
  UserIcon,
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/vue/24/outline";
import { ref } from "vue";
import { RouterLink } from "vue-router";
import keycloak from "@/keycloak"; // dein Singleton

const realm = keycloak.realm;
const accountUrl = `${keycloak.authServerUrl?.replace(
  /\/$/,
  ""
)}/realms/${realm}/account`;

const showUserMenu = ref(false);
const showMainMenu = ref(false);

const closeAll = () => {
  showUserMenu.value = false;
  showMainMenu.value = false;
};

const handleSettings = () => {
  console.log("Einstellungen clicked");
  closeAll();
};

const handleLogout = async () => {
  showUserMenu.value = false;
  try {
    await keycloak.logout({ redirectUri: window.location.origin + "/" });
  } catch (err) {
    console.error("Logout fehlgeschlagen", err);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    keycloak.token = null;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    keycloak.authenticated = false;
    window.location.href = window.location.origin + "/";
  }
};
</script>

<template>
  <div class="w-3/5 flex justify-between items-center py-8 relative">
    <!-- Menü Button + Dropdown (optisch wie User-Dropdown) -->
    <div class="relative z-6">
      <button
        class="bg-white hover:bg-gray-300 rounded-md cursor-pointer"
        @click="(showMainMenu = !showMainMenu), (showUserMenu = false)"
      >
        <Bars3Icon class="size-8 text-gray-500" />
      </button>

      <!-- Hauptmenü-Popup -->
      <div
        v-if="showMainMenu"
        class="absolute left-0 top-12 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-5"
      >
        <ul class="py-2">
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <RouterLink to="/" @click.native="closeAll">Home</RouterLink>
          </li>
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <RouterLink to="/seminars" @click.native="closeAll"
              >Seminarübersicht</RouterLink
            >
          </li>
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <RouterLink to="/my-seminars" @click.native="closeAll"
              >Meine Seminare</RouterLink
            >
          </li>
        </ul>
      </div>
    </div>

    <!-- Titel -->
    <h1 class="font-sans text-lg">NAK Seminarplatzbörse</h1>

    <!-- User Button + Dropdown (unverändert) -->
    <div
      @click="(showUserMenu = !showUserMenu), (showMainMenu = false)"
      class="rounded-full size-10 bg-gray-200 flex items-center justify-center cursor-pointer group relative z-6"
      :class="showUserMenu ? '' : 'hover:bg-gray-300'"
    >
      <UserIcon class="size-7 text-gray-500" />

      <!-- User-Popup -->
      <div
        v-if="showUserMenu"
        class="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-5"
      >
        <ul class="py-2">
          <li
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
          >
            <a
              :href="accountUrl"
              target="_blank"
              rel="noopener"
              class="w-full h-full flex items-center justify-start gap-2"
              ><UserIcon class="size-5 text-gray-500" /> Profil</a
            >
          </li>

          <li
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 border-t-1 border-t-gray-300"
            @click="handleLogout"
          >
            <ArrowRightStartOnRectangleIcon class="size-5 text-gray-500" />
            Logout
          </li>
        </ul>
      </div>
    </div>

    <!-- Gemeinsamer Click-Outside -->
    <div
      class="fixed inset-0 z-5"
      v-if="showUserMenu || showMainMenu"
      @click="closeAll"
    ></div>
  </div>
</template>
