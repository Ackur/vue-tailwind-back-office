<template>
  <component
    ref="buttonRef"
    :is="props.as"
    :disabled="disabled || loading"
    :type="props.as === 'button' ? props.type : ''"
    :class="[
      buttonClasses,
      props.text && colorClasses.text[props.color],
      props.light && !props.outline && colorClasses.light[props.color],
      !props.text && !props.light && !props.outline && colorClasses.default[props.color],
      props.outline && !props.light && colorClasses.outline[props.color],
      props.outline && props.light && colorClasses.outlineLight[props.color],
      props.icon ? 'w-fit !p-0' : '',
      sizesClasses[size],
      activeColor[props.activeColor],
      hoverColor[props.hoverColor],
      activeTextColor[props.activeTextColor],
      hoverTextColor[props.hoverTextColor],
      disabled && '!opacity-40 shadow-none',
      disabled && outline && 'hover:!bg-inherit active:!bg-inherit'
    ]"
  >
    <div v-if="props.loading" class="absolute inset-0 grid place-items-center bg-black/10">
      <InlineSvg src="/media/icons/spiner-icon.svg" class="animate-spin h-6 w-6" />
    </div>
    <slot name="left-icon">
      <InlineSvg v-if="typeof props.leftIcon === 'string'" :src="props.leftIcon" />
    </slot>
    <slot />

    <slot name="right-icon">
      <InlineSvg v-if="typeof props.rightIcon === 'string'" :src="props.rightIcon" />
    </slot>
  </component>
</template>

<script setup>
import { ref } from 'vue'
import {
  buttonClasses,
  colorClasses,
  sizesClasses,
  activeColor,
  hoverColor,
  activeTextColor,
  hoverTextColor
} from './app-button.config'
import InlineSvg from 'vue-inline-svg'

const props = defineProps({
  as: {
    type: String,
    default: 'button',
    validator(value) {
      return ['button', 'a', 'RouterLink'].includes(value)
    }
  },
  color: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' },
  activeColor: String,
  hoverColor: String,
  activeTextColor: String,
  hoverTextColor: String,
  light: Boolean,
  outline: Boolean,
  text: Boolean,
  disabled: Boolean,
  loading: Boolean,
  icon: Boolean,
  leftIcon: [String, Object],
  rightIcon: [String, Object]
})

const buttonRef = ref()

function focus() {
  buttonRef.value?.focus()
}

defineExpose({ focus })
</script>
