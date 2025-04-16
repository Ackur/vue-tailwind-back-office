<script setup></script>

<template>
  <div class="absolute inset-0 z-10 backdrop-blur-[2px]">
    <div class="table-loader w-full h-full rounded-b-xl opacity-10"></div>
  </div>
</template>

<style lang="scss" scoped>
.table-loader {
  background: linear-gradient(
    90deg,
    theme('colors.light.DEFAULT'),
    theme('colors.dark.DEFAULT'),
    theme('colors.light.DEFAULT'),
    theme('colors.dark.DEFAULT'),
    theme('colors.light.DEFAULT'),
    theme('colors.dark.DEFAULT'),
    theme('colors.light.DEFAULT'),
    theme('colors.dark.DEFAULT'),
    theme('colors.light.DEFAULT')
  );
  animation: animate 15s linear infinite;
  background-size: 500%;
  filter: blur(20px);
}

@keyframes animate {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 500% 0;
  }
}
</style>
