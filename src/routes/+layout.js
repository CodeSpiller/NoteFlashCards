// Fully static, client-rendered app. The store uses localStorage, so there's
// no value in SSR for this app and disabling it simplifies the prerender pass.
export const prerender = true;
export const ssr = false;
