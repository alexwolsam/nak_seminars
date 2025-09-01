<script setup lang="ts">
import { ref, computed } from "vue";

// Dummy-Daten, später ersetzen durch API-Aufruf
const seminars = ref([
  {
    id: 1,
    title: "Einführung in Cloud Computing",
    available: 0,
    status: "queue",
    deadline: "2025-08-30",
  },
  {
    id: 2,
    title: "Künstliche Intelligenz Basics",
    available: 1,
    status: "none",
    deadline: "2025-08-31",
  },
  {
    id: 3,
    title: "Microservices Architektur",
    available: 10,
    status: "none",
    deadline: "2025-08-02",
  },
  {
    id: 4,
    title: "Microservices Architektur 2",
    available: 20,
    status: "participating",
    deadline: "2025-08-31",
  },
  {
    id: 5,
    title: "Microservices Architektur 3",
    available: 5,
    status: "queue",
    deadline: "2025-08-31",
  },
  {
    id: 6,
    title: "Microservices Architektur 4",
    available: 0,
    status: "none",
    deadline: "2025-08-31",
  },
  {
    id: 7,
    title: "Microservices Architektur 5",
    available: 2,
    status: "participating",
    deadline: "2025-08-31",
  },
]);

// Suchtext
const search = ref("");

// Gefilterte Liste
const filteredSeminars = computed(() => {
  if (!search.value) return seminars.value;
  return seminars.value.filter((s) =>
    s.title.toLowerCase().includes(search.value.toLowerCase())
  );
});
</script>

<template>
  <div
    class="w-full max-w-3xl mx-auto py-6 box-border max-h-full overflow-y-auto"
  >
    <!-- Suchfeld -->
    <input
      v-model="search"
      type="text"
      placeholder="Seminar suchen..."
      class="w-full border rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
    />

    <!-- Seminarliste -->
    <div class="space-y-4">
      <div
        v-for="s in filteredSeminars"
        :key="s.id"
        class="border rounded-lg p-4 bg-white shadow hover:shadow-md transition flex justify-between items-center"
      >
        <div class="w-full h-full flex flex-col justify-around items-start">
          <h2 class="text-lg font-semibold">{{ s.title }}</h2>
          <p class="text-sm text-gray-600">
            Verfügbare Plätze: {{ s.available }}
          </p>
          <p class="text-sm text-gray-600">
            Frist: {{ new Date(s.deadline).toLocaleDateString("en-GB") }}
          </p>

          <!-- Status/Buttons -->
          <div class="mt-2">
            <button
              v-if="new Date(s.deadline) < new Date()"
              class="px-3 py-1 text-sm bg-gray-500 text-white rounded"
            >
              Abgelaufen
            </button>
            <button
              v-else-if="s.status === 'none' && s.available > 0"
              class="px-3 py-1 text-sm bg-blue-500 text-white rounded"
            >
              Verfügbar
            </button>
            <button
              v-if="s.status === 'none' && s.available === 0"
              class="px-3 py-1 text-sm bg-red-500 text-white rounded"
            >
              Voll
            </button>
            <button
              v-else-if="s.status === 'queue'"
              class="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
            >
              Auf Warteliste
            </button>
            <button
              v-else-if="s.status === 'participating'"
              class="px-3 py-1 text-sm bg-green-500 text-white rounded"
            >
              Teilnehmer
            </button>
          </div>
        </div>
        <div class="mt-2 w-1/4">
          <button
            class="bg-gray-200 p-5 w-full rounded-md cursor-pointer hover:bg-gray-300 border-1 border-gray-800"
            v-if="s.status === 'none' && new Date(s.deadline) > new Date()"
          >
            Anmelden
          </button>

          <button
            class="bg-red-300 p-4 w-full rounded-md cursor-pointer hover:bg-red-400 border-1 border-red-800"
            v-else-if="
              s.status === 'queue' && new Date(s.deadline) > new Date()
            "
          >
            Verlassen
          </button>
          <button
            class="bg-red-300 p-4 w-full rounded-md cursor-pointer hover:bg-red-400 border-1 border-red-800"
            v-else-if="s.status !== 'none' && new Date(s.deadline) > new Date()"
          >
            Abgeben
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
