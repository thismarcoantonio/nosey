/// <reference types="vite/client" />
/// <reference types="vite-plus/client" />
/// <reference types="google.accounts" />

declare global {
  interface Window {
    google: typeof google
  }
}

export {}
