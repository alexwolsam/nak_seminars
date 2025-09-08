import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import keycloak, { initKeycloak } from "./keycloak";
import "./main.css";
import { setAuthToken } from "./api";

initKeycloak()
  .then(() => {
    const app = createApp(App);
    setAuthToken(keycloak.token ?? "");
    app.use(router);
    app.mount("#app");
  })
  .catch((err) => {
    console.error("Keycloak init fehlgeschlagen", err);
    // Optional: fallback mount, oder App mit Fehleranzeige mounten
    const app = createApp(App);
    app.use(router);
    app.mount("#app");
  });
