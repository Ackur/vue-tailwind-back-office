<script setup>
import InlineSvg from 'vue-inline-svg'

const props = defineProps({
  title: String,
  desc: String,
  type: {
    type: String,
    default: 'success',
    validator: (val) => ['success', 'danger'].includes(val)
  },
  maxWidth: {
    type: String,
    default: 'max-w-[410px]'
  },
  maxHeight: {
    type: String,
    default: 'max-h-[500px]'
  }
})
const types = {
  success: { icon: 'media/icons/check-v2-icon.svg', iconClasses: 'border-success text-success' },
  danger: { icon: 'media/icons/close-icon.svg', iconClasses: 'border-danger text-danger' }
}
</script>

<template>
  <div
    class="h-full w-full flex items-center justify-center bg-white rounded-xl shadow-xl px-6 py-12"
    :class="[props.maxWidth, props.maxHeight]"
  >
    <div class="flex flex-col items-center">
      <div
        class="w-32 h-32 rounded-full border-[8px] drop-shadow-[2px_4px_3px_gray]"
        :class="[types[type].iconClasses]"
      >
        <InlineSvg :src="asset(types[type].icon)" class="w-full h-auto" />
      </div>
      <h1 class="text-2xl font-semibold mt-6 mb-3">{{ props.title }}</h1>
      <p class="text-center leading-tight">{{ props.desc }}</p>

      <slot name="actions"> </slot>
    </div>
  </div>
</template>
