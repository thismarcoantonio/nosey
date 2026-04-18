<template>
  <div class="min-h-screen bg-slate-950">
    <router-view />
  </div>
</template>

<style>
@import 'tailwindcss';

@theme {
  --color-primary-50: #fff0f2;
  --color-primary-100: #ffe0e5;
  --color-primary-200: #ffc0cc;
  --color-primary-300: #ff8fa3;
  --color-primary-400: #ff5175;
  --color-primary-500: #ff1a4b;
  --color-primary-600: #e8002f;
  --color-primary-700: #c10026;
  --color-primary-800: #a00024;
  --color-primary-900: #850024;
  --color-primary-950: #4b000f;
}
</style>
