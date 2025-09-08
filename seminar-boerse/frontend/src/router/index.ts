import { createRouter, createWebHistory } from "vue-router";
import SeminarList from "../components/SeminarList.vue";
import HomeScreen from "@/components/HomeScreen.vue";
import MySeminars from "@/components/MySeminars.vue";
import keycloak from "@/keycloak";
import AdminScreen from "@/components/AdminScreen.vue";

const routes = [
  { path: "/seminars", name: "Seminars", component: SeminarList },
  { path: "/", name: "Home", component: HomeScreen },
  { path: "/my-seminars", name: "My Seminars", component: MySeminars },
  { path: "/:pathMatch(.*)*", redirect: "/" },

  {
    path: "/admin",
    name: "Admin",
    component: AdminScreen,
    meta: { requiresAuth: true, roles: ["seminar-admin"] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];

  if (requiresAuth) {
    const requiredRoles = (to.meta.roles as string[]) || [];
    const hasRequiredRole = requiredRoles.every((role: string) =>
      userRoles.includes(role)
    );
    if (!keycloak.authenticated) {
      keycloak.login();
    } else {
      if (hasRequiredRole) {
        next();
      } else {
        next({ path: "/" });
      }
    }
  } else {
    next();
  }
});

export default router;
