<script setup>
import { asset } from '@/core/utils/utils'

import InlineSvg from 'vue-inline-svg'

const props = defineProps({ show: Boolean })
</script>

<template>
  <Transition
    enter-active-class="transition duration-500 ease-in-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-500 ease-in-out"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="props.show"
      class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center"
    >
      <InlineSvg
        :src="asset('media/icons/pic1-icon.svg')"
        class="w-[200px] h-[200px] ease-in-out duration-300 text-success animate"
      />
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.animate {
  animation: animate 1.2s infinite ease-in-out;
}

@keyframes animate {
  0% {
    scale: 1.1;
  }
  50% {
    opacity: 0.5;
    scale: 1;
  }
  100% {
    rotate: 360deg;
    scale: 1.1;
  }
}
</style>
