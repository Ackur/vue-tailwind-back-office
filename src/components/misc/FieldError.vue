<script setup>
const props = defineProps({ message: [String, Boolean, Object] })
</script>

<template>
  <Transition enter-active-class="show-message" leave-active-class="show-message-reverse">
    <div
      v-if="props.message"
      v-t="props.message"
      class="text-sm text-danger over leading-none truncate will-change-[height]"
    ></div>
  </Transition>
</template>

<style lang="scss" scoped>
.show-message {
  animation: show-message 0.2s ease;
}
.show-message-reverse {
  animation: show-message 0.2s ease reverse;
}
@keyframes show-message {
  0% {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
  }
  100% {
    max-height: 28px;
    height: fit-content;
  }
}
</style>
