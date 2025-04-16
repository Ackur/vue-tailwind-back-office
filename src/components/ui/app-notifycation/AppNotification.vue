<script setup>
import { useNotifications } from './composables/useNotify.js'
import InlineSvg from 'vue-inline-svg'

const $toaster = useNotifications()
</script>

<template>
  <Teleport to="body">
    <TransitionGroup
      tag="div"
      name="list"
      enter-active-class="show-list"
      leave-active-class="show-list-reverse"
      class="fixed top-0 right-0 flex flex-col items-end gap-2 max-w-[50%] max-lg:max-w-full font-inter text-gray-800 mt-20 mx-2 z-10"
    >
      <div
        v-for="(item, idx) in $toaster.notifications"
        :key="item.id"
        class="w-fit flex items-center gap-2 rounded shadow px-3 py-2 transition-shadow hover:shadow-md"
        :class="[item.bgClass || 'bg-primary', item.textClass, item.wrapClass]"
        @click="$toaster.close(idx)"
        @mouseenter="$toaster.mouseenter(idx)"
        @mouseleave="$toaster.mouseleave(idx)"
      >
        <InlineSvg :src="item.icon" class="h-6 w-6 min-w-[24px]" :class="[item.iconClass]" />
        <div>
          <h6 class="font-semibold leading-none">{{ item.title }}</h6>
          <p class="leading-none" :class="[item.textClass]">{{ item.text }}</p>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<style lang="scss" scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.show-list {
  animation: show-list 0.5s ease;
}
.show-list-reverse {
  animation: show-list 0.5s ease reverse;
}
@keyframes show-list {
  0% {
    transform: translateX(100%);
    opacity: 0;
    overflow: hidden;
  }
  50% {
    transform: translateX(-15px);
  }
}
</style>
