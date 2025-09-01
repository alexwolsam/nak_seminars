import Keycloak from "keycloak-js";

//
const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "nak-seminar-um",
  clientId: "fe",
});

export async function initKeycloak() {
  await keycloak.init({
    onLoad: "login-required",
    pkceMethod: "S256",
    checkLoginIframe: false,
  });
  return keycloak;
}
export default keycloak;
