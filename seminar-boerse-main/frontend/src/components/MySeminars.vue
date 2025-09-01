<script setup lang="ts">
import { ref, computed } from "vue";

type Status = "none" | "queue" | "participating";

interface Seminar {
  id: number;
  title: string;
  available: number; // freie Plätze
  status: Status; // none | queue | participating
  deadline: string; // "2025-08-31"
}

// Dummy-Daten (später via API ersetzen)
const seminars = ref<Seminar[]>([
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
    available: 0,
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

// Hilfen
const today = () => new Date();
const isOverdue = (iso: string) => new Date(iso) < today();
const fmtDE = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
};

// Aufgeteilt nach Status
const participating = computed(() =>
  seminars.value.filter((s) => s.status === "participating")
);
const queued = computed(() =>
  seminars.value.filter((s) => s.status === "queue")
);

// Actions (später API-Calls einhängen)
const leaveQueue = (id: number) => {
  console.log("leave queue", id);
  const s = seminars.value.find((x) => x.id === id);
  if (s) s.status = "none";
};
const dropSeat = (id: number) => {
  console.log("drop seat", id);
  const s = seminars.value.find((x) => x.id === id);
  if (s) s.status = "none";
};
</script>

<template>
  <div
    class="w-3/5 px-5 max-h-[90%] h-4/5 flex gap-4 box-border items-center justify-start"
  >
    <!-- Linke Spalte: Meine Seminare -->
    <div class="w-1/2 h-4/5 border-1 border-gray-300 rounded-md bg-white">
      <h1
        class="w-fit px-3 -translate-y-4 bg-white translate-x-3 text-xl font-semibold"
      >
        Meine Seminare
      </h1>

      <div class="h-[calc(100%-2.5rem)] px-3 pb-3 overflow-y-auto">
        <template v-if="participating.length">
          <div
            v-for="s in participating"
            :key="s.id"
            class="border rounded-md p-3 mb-3 flex items-start justify-between"
          >
            <div class="pr-3">
              <div class="font-medium">{{ s.title }}</div>
              <div class="text-xs text-gray-600 mt-1">
                Frist: {{ fmtDE(s.deadline) }}
              </div>
              <div class="text-xs text-gray-600">
                Verfügbar: {{ s.available }}
              </div>

              <div class="mt-2">
                <span
                  class="inline-block text-xs px-2 py-0.5 rounded bg-green-100 text-green-700"
                >
                  Teilnehmer
                </span>
                <span
                  v-if="isOverdue(s.deadline)"
                  class="inline-block text-xs ml-2 px-2 py-0.5 rounded bg-gray-200 text-gray-700"
                >
                  Abgelaufen
                </span>
              </div>
            </div>

            <div class="w-28 shrink-0">
              <button
                v-if="!isOverdue(s.deadline)"
                class="bg-red-300 w-full py-2 rounded-md cursor-pointer hover:bg-red-400 border-1 border-red-800 text-sm"
                @click="dropSeat(s.id)"
              >
                Abgeben
              </button>
              <button
                v-else
                class="bg-gray-200 w-full py-2 rounded-md border-1 border-gray-400 text-sm cursor-default"
              >
                Abgelaufen
              </button>
            </div>
          </div>
        </template>

        <p v-else class="text-sm text-gray-500 px-1">
          Keine aktiven Teilnahmen.
        </p>
      </div>
    </div>

    <!-- Rechte Spalte: Warteliste -->
    <div class="w-1/2 h-4/5 border-1 border-gray-300 rounded-md bg-white">
      <h1
        class="w-fit px-3 -translate-y-4 bg-white translate-x-3 text-xl font-semibold"
      >
        Warteliste
      </h1>

      <div class="h-[calc(100%-2.5rem)] px-3 pb-3 overflow-y-auto">
        <template v-if="queued.length">
          <div
            v-for="s in queued"
            :key="s.id"
            class="border rounded-md p-3 mb-3 flex items-start justify-between"
          >
            <div class="pr-3">
              <div class="font-medium">{{ s.title }}</div>
              <div class="text-xs text-gray-600 mt-1">
                Frist: {{ fmtDE(s.deadline) }}
              </div>
              <div class="text-xs text-gray-600">
                Verfügbar: {{ s.available }}
              </div>

              <div class="mt-2">
                <span
                  class="inline-block text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700"
                >
                  Auf Warteliste
                </span>
                <span
                  v-if="isOverdue(s.deadline)"
                  class="inline-block text-xs ml-2 px-2 py-0.5 rounded bg-gray-200 text-gray-700"
                >
                  Abgelaufen
                </span>
              </div>
            </div>

            <div class="w-28 shrink-0">
              <button
                v-if="!isOverdue(s.deadline)"
                class="bg-red-300 w-full py-2 rounded-md cursor-pointer hover:bg-red-400 border-1 border-red-800 text-sm"
                @click="leaveQueue(s.id)"
              >
                Verlassen
              </button>
              <button
                v-else
                class="bg-gray-200 w-full py-2 rounded-md border-1 border-gray-400 text-sm cursor-default"
              >
                Abgelaufen
              </button>
            </div>
          </div>
        </template>

        <p v-else class="text-sm text-gray-500 px-1">
          Du stehst in keiner Warteliste.
        </p>
      </div>
    </div>
  </div>
</template>
