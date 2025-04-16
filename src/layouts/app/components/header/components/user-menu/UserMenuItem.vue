<script setup>
import InlineSvg from 'vue-inline-svg'

const props = defineProps({
  title: String,
  attrs: Object,
  tag: { type: String, default: 'button' },
  icon: String,
  iconClasses: String
})
</script>

<template>
  <component
    :is="props.tag"
    class="h-10 w-full flex items-center gap-2 cursor-pointer rounded hover:bg-primary/10 active:text-primary px-2"
    v-bind="props.attrs"
  >
    <InlineSvg
      v-if="props.icon"
      :src="props.icon"
      class="text-primary w-full min-w-[24px] max-w-[24px] h-auto"
      :class="[props.iconClasses]"
    />
    <span class="leading-none">{{ props.title }}</span>

    <slot name="append"></slot>
  </component>
</template>
