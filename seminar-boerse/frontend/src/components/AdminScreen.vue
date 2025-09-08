<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { createSeminar, deleteSeminar, fetchSeminars } from "@/api"; // du musst sicherstellen, dass deleteSeminar existiert
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";

const seminars = ref<any[]>([]);
const search = ref("");

// Modal-Steuerung
const showModalAdd = ref(false);
const editingSeminar = ref<any>(null);

const form = ref({
  title: "",
  available: 0,
  deadline: "",
});

// API
const loadSeminars = async () => {
  seminars.value = await fetchSeminars();
};

onMounted(loadSeminars);

// Modal-Handling
const openCreateModal = () => {
  editingSeminar.value = null;
  form.value = { title: "", available: 0, deadline: "" };
  showModalAdd.value = true;
};

const openEditModal = (seminar: any) => {
  editingSeminar.value = seminar;
  form.value = {
    title: seminar.title,
    available: seminar.available,
    deadline: seminar.deadline.slice(0, 10), // yyyy-mm-dd für <input type="date">
  };
};

const closeModalAdd = () => {
  showModalAdd.value = false;
};

const addSeminar = async () => {
  await createSeminar(form.value);
  await loadSeminars();
  closeModalAdd();
};

const removeSeminar = async (seminarId: number) => {
  if (confirm("Willst du dieses Seminar wirklich löschen?")) {
    await deleteSeminar(seminarId);
    await loadSeminars();
  }
};

// Filter
const filteredSeminars = computed(() => {
  if (!search.value) return seminars.value;
  return seminars.value.filter((s: any) =>
    s.title.toLowerCase().includes(search.value.toLowerCase())
  );
});
</script>

<template>
  <div
    class="w-full max-w-4xl mx-auto py-6 box-border max-h-full overflow-y-auto"
  >
    <!-- Kopf -->
    <div class="flex justify-between items-center mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Seminar suchen..."
        class="w-2/3 border rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
      <button
        class="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        @click="openCreateModal"
      >
        <PlusIcon class="size-5" /> Seminar hinzufügen
      </button>
    </div>

    <!-- Seminarliste -->
    <div class="space-y-4">
      <div
        v-for="s in filteredSeminars"
        :key="s.id"
        class="border rounded-lg p-4 bg-white shadow hover:shadow-md transition flex justify-between items-center"
      >
        <div>
          <h2 class="text-lg font-semibold">{{ s.title }}</h2>
          <p class="text-sm text-gray-600">
            Verfügbare Plätze: {{ s.available }}
          </p>
          <p class="text-sm text-gray-600">
            Frist: {{ new Date(s.deadline).toLocaleDateString("de-DE") }}
          </p>
        </div>

        <!-- Aktionen -->
        <div class="flex gap-2">
          <PencilSquareIcon
            class="size-6 text-gray-600 cursor-pointer hover:text-blue-600"
            @click="openEditModal(s)"
          />
          <TrashIcon
            class="size-6 text-gray-600 cursor-pointer hover:text-red-600"
            @click="removeSeminar(s.id)"
          />
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModalAdd"
      class="fixed inset-0 flex items-center justify-center z-10 h-full w-full"
    >
      <div
        class="absolute inset-0 bg-black opacity-50"
        @click="closeModalAdd"
      ></div>
      <div
        class="bg-white rounded-lg shadow-lg w-2/5 p-6 relative opacity-100 h-3/4"
      >
        <h2 class="text-lg font-semibold mb-12">
          {{
            editingSeminar ? "Seminar bearbeiten" : "Neues Seminar hinzufügen"
          }}
        </h2>
        <div class="space-y-4 h-1/2 flex justify-between flex-col">
          <label class="block font-medium" for="title">Titel</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            placeholder="Titel"
            class="w-full border rounded-md px-3 py-2"
          />
          <label class="block font-medium" for="available"
            >Verfügbare Plätze</label
          >
          <input
            id="available"
            v-model.number="form.available"
            type="number"
            placeholder="Verfügbare Plätze"
            class="w-full border rounded-md px-3 py-2"
          />
          <label class="block font-medium" for="deadline">Anmeldefrist</label>
          <input
            id="deadline"
            v-model="form.deadline"
            type="date"
            class="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            @click="closeModalAdd"
          >
            Abbrechen
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="addSeminar"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
