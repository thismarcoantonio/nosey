<template>
  <router-view />
</template>

<style>
@import 'tailwindcss';

@theme {
  --color-canvas: #faf3df;
  --color-ochre: #cd9a3a;
  --color-dusty-rose: #eddcd3;
  --color-primary-50: #edf5eb;
  --color-primary-100: #a7c89d;
  --color-primary-200: #8fb98a;
  --color-primary-300: #7ea475;
  --color-primary-400: #688f5f;
  --color-primary-500: #547a4c;
  --color-primary-600: #426239;
  --color-primary-700: #324b2b;
  --color-primary-800: #22341e;
  --color-primary-900: #141f12;
  --color-primary-950: #0d150b;
}

body {
  @apply bg-canvas text-slate-700;
}
</style>
