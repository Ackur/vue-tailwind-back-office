<script setup>
import { colorClasses, colorTextClasses, sizesClasses, defaultClasses } from './app-badge.config.js'

const props = defineProps({
  size: {
    type: String,
    default: 'md'
  },
  color: {
    type: String,
    default: 'primary'
  },
  colorText: String,
  outline: Boolean,
  light: Boolean
})
</script>

<template>
  <div
    :class="[
      defaultClasses,
      sizesClasses[props.size],
      colorTextClasses[props.colorText],
      !props.outline && !props.light && colorClasses.default[props.color],
      !props.outline && props.light && colorClasses.light[props.color],
      props.outline && !props.light && colorClasses.outline[props.color],
      props.outline && props.light && colorClasses.outlineLight[props.color]
    ]"
  >
    <slot />
  </div>
</template>
