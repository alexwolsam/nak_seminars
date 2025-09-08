<script setup lang="ts">
import { fetchEnrollments, fetchSeminars, unenrollUser } from "@/api";
import { ref, computed, onMounted } from "vue";

type Status = "none" | "queue" | "enrolled";

interface Seminar {
  id: number;
  title: string;
  available: number; // freie Plätze
  status: Status; // none | queue | enrolled
  deadline: string; // "2025-08-31"
}

// Dummy-Daten (später via API ersetzen)
const enrolledSeminars = ref<any>([]);

const loadSeminars = async () => {
  const enrollments = await fetchEnrollments();
  const allSeminars = await fetchSeminars();
  enrolledSeminars.value = enrollments.map((enr: any) => {
    const sem = allSeminars.find((s: any) => s.id === enr.seminarId);
    return {
      seminarId: enr.seminarId,
      title: sem?.title ?? "Unbekannt",
      available: sem?.available ?? 0,
      status: enr.status as Status,
      deadline: sem?.deadline ?? "2099-12-31",
    };
  });
};

onMounted(async () => {
  await loadSeminars();
});
// Hilfen
const today = () => new Date();
const isOverdue = (iso: string) => new Date(iso) < today();

// Aufgeteilt nach Status
const enrolled = computed(() =>
  enrolledSeminars.value.filter((s: any) => s.status === "enrolled")
);
const queued = computed(() =>
  enrolledSeminars.value.filter((s: any) => s.status === "queue")
);

// Actions (später API-Calls einhängen)
const leaveQueue = async (id: number) => {
  await unenrollUser(id.toString());
  await loadSeminars();
};
const dropSeat = async (id: number) => {
  await unenrollUser(id.toString());
  await loadSeminars();
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
        <template v-if="enrolled.length">
          <div
            v-for="s in enrolled"
            :key="s.id"
            class="border rounded-md p-3 mb-3 flex items-start justify-between"
          >
            <div class="pr-3">
              <div class="font-medium">{{ s.title }}</div>
              <div class="text-xs text-gray-600 mt-1">
                Frist: {{ new Date(s.deadline).toLocaleDateString("de-DE") }}
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
                @click="dropSeat(s.seminarId)"
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

        <p v-else class="text-sm text-gray-500 px-1 text-center w-full">
          - Keine aktiven Teilnahmen. -
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
                Frist: {{ new Date(s.deadline).toLocaleDateString("en-GB") }}
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
                @click="leaveQueue(s.seminarId)"
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

        <p v-else class="text-sm text-gray-500 px-1 w-full text-center">
          - Du stehst in keiner Warteliste. -
        </p>
      </div>
    </div>
  </div>
</template>
