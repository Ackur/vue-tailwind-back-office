<script setup>
import { ref, computed, watch } from 'vue'
import { createPopper } from '@popperjs/core'
import {
  popperPlacements,
  tooltipShodowClasses,
  tooltipArrowClasses
} from '@/components/misc/popper-component/popper.config.js'

const props = defineProps({
  visible: Boolean,
  dependentRef: { type: Object, default: null },
  placement: { type: String, default: 'bottom' },
  offset: { type: Array, default: () => [0, 0] },
  sameWidth: { type: Boolean, default: false },
  arrow: { type: Boolean, default: false },
  disableDefaulShadow: { type: Boolean, default: false },
  wrapClasses: { type: [String, Array], default: '' }
})

const popperInstance = ref()
const popperRef = ref()
const arrowRef = ref()

const animations = {
  top: { enter: 'animate-fall-up', leave: 'animate-fall-up-reverse' },
  bottom: { enter: 'animate-fall-down', leave: 'animate-fall-down-reverse' },
  right: { enter: 'animate-fall-right', leave: 'animate-fall-right-reverse' },
  left: { enter: 'animate-fall-left', leave: 'animate-fall-left-reverse' }
}

const getAnimation = computed(() => {
  const direction = props.placement.split('-').at(0)
  return animations[direction] || { enter: '', leave: '' }
})

function initListPopperInstance(listenersState = false) {
  popperInstance.value = createPopper(props.dependentRef, popperRef.value, {
    placement: popperPlacements.includes(props.placement) ? props.placement : 'auto',
    strategy: 'fixed', //fixed|absolute
    modifiers: [
      ...(!props.sameWidth
        ? []
        : [
            {
              name: 'sameWidth',
              enabled: true,
              phase: 'beforeWrite',
              requires: ['computeStyles'],
              fn: ({ state }) => {
                state.styles.popper.width = `${state.rects.reference.width}px`
              },
              effect: ({ state }) => {
                state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`
              }
            }
          ]),
      {
        name: 'offset',
        options: {
          offset: props.offset
        }
      },
      {
        name: 'computeStyles',
        options: {
          gpuAcceleration: false
        }
      },
      { name: 'eventListeners', enabled: listenersState }
    ]
  })
  popperInstance.value.update()
}

watch(
  () => props.visible,
  (val) => {
    if (popperRef.value && props.dependentRef) {
      if (popperInstance.value) {
        val && popperInstance.value.update()
      } else {
        initListPopperInstance(true)
      }
    }
  },
  { flush: 'post', immediate: true }
)
</script>

<template>
  <Transition :enter-active-class="getAnimation.enter" :leave-active-class="getAnimation.leave">
    <div
      v-show="props.visible"
      ref="popperRef"
      class="group"
      :class="[!props.disableDefaulShadow && tooltipShodowClasses, props.wrapClasses]"
    >
      <slot />
      <div v-if="props.arrow" ref="arrowRef" data-popper-arrow :class="[tooltipArrowClasses]" />
    </div>
  </Transition>
</template>
