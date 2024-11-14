export const FRONTEND_URL = process?.env?.FRONTEND_URL ?? "https://snippet-searcher.duckdns.org/"
export const BACKEND_URL = process?.env?.BACKEND_URL ?? "https://snippet-searcher.duckdns.org/"
export const AUTH0_USERNAME = process?.env?.AUTH0_USERNAME ?? "snippetUser@example.com"
export const AUTH0_PASSWORD = process?.env?.AUTH0_PASSWORD ?? "SnippetPassword123!"
export const AUTH0_DOMAIN = process?.env?.VITE_AUTH0_DOMAIN ?? "dev-5zdc2llcm7omxrr3.us.auth0.com"
export const AUTH0_CLIENT_ID = process?.env?.VITE_AUTH0_CLIENT_ID ?? "1nDDen6V7SjjgKDMDVtfvd98SruHLwsm"
export const auth0_domain = process?.env?.auth0_domain ?? "dev-5zdc2llcm7omxrr3.us.auth0.com"
export const AUTH0_AUDIENCE = process?.env?.VITE_AUTH0_AUDIENCE ?? "https://SnippetSercher-API2/"

//export const AUTH0_AUDIENCE_2 = import.meta.env.VITE_AUTH0_AUDIENCE ?? ""