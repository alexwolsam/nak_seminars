import { createRouter, createWebHistory } from "vue-router";
import SeminarList from "../components/SeminarList.vue";
import HomeScreen from "@/components/HomeScreen.vue";
import MySeminars from "@/components/MySeminars.vue";

const routes = [
  { path: "/seminars", name: "Seminars", component: SeminarList },
  { path: "/", name: "Home", component: HomeScreen },
  { path: "/my-seminars", name: "My Seminars", component: MySeminars },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
