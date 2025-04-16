<script setup>
import { ref, computed, getCurrentInstance } from 'vue'
import InlineSvg from 'vue-inline-svg'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: {
    type: String,
    default: ''
  },
  overlayTransparent: {
    type: Boolean,
    default: false
  },
  maxWidth: {
    type: String,
    default: '800px'
  },
  position: {
    type: String,
    default: 'center',
    validator: (value) => {
      return value.match(
        /(left|center|right|top|bottom|top-left|top-right|bottom-left|bottom-right)/
      )
    }
  },
  closeButton: {
    type: Boolean,
    default: true
  },
  footerClasses: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['click:outside', 'click:close'])
const slots = defineSlots()
const attrs = getCurrentInstance()

const notClosureClass = ref('')

const positionClasses = {
  center: 'self-center justify-self-center',
  left: 'self-center',
  right: 'self-center justify-self-end',
  top: 'justify-self-center',
  bottom: 'self-end justify-self-center',
  'top-left': '',
  'top-right': 'justify-self-end',
  'bottom-left': 'self-end',
  'bottom-right': 'self-end justify-self-end'
}

const transitionClasses = computed(() => {
  const classes = {
    top: {
      'enter-from': '[&>div]:-mt-20',
      'enter-to': '[&>div]:mt-0',
      'leave-from': '[&>div]:mt-0',
      'leave-to': '[&>div]:-mt-20'
    },
    bottom: {
      'enter-from': '[&>div]:-mb-20',
      'enter-to': '[&>div]:mb-0',
      'leave-from': '[&>div]:mb-0',
      'leave-to': '[&>div]:-mb-20'
    },
    center: {
      'enter-from': '[&>div]:scale-75',
      'enter-to': '[&>div]:scale-100',
      'leave-from': '[&>div]:scale-100',
      'leave-to': '[&>div]:scale-75'
    }
  }
  const position = props.position.includes('bottom')
    ? 'bottom'
    : props.position.includes('center')
    ? 'center'
    : 'top'
  return classes[position]
})

function onClickOverlay(evt) {
  if (evt.target.dataset.overlay) {
    emit('click:outside', true)
    if (!attrs.vnode.props['onClick:outside']) {
      notClosureClass.value = 'animate-scale'
      setTimeout(() => {
        notClosureClass.value = ''
      }, 500)
    }
  }
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-in [&>div]:transition-all [&>div]:duration-200 [&>div]:delay-200"
    :enter-from-class="`!bg-dark/0 [&>div]:opacity-0 [&>div]:opacity-0 ${transitionClasses['enter-from']}`"
    :enter-to-class="`!bg-dark/50 [&>div]:opacity-100 ${transitionClasses['enter-to']}`"
    leave-active-class="transition-all duration-300 delay-200 ease-out [&>div]:transition-all [&>div]:duration-200"
    :leave-from-class="`bg-dark/50 [&>div]:opacity-100 ${transitionClasses['leave-from']}`"
    :leave-to-class="`bg-dark/0 [&>div]:opacity-0 ${transitionClasses['leave-to']}`"
  >
    <div
      v-if="props.show"
      data-overlay="true"
      class="fixed top-0 left-0 w-full h-full grid bg-dark/50 p-5 z-50 overflow-y-auto will-change-auto"
      :class="[{ '!bg-transparent': props.overlayTransparent }]"
      @click="onClickOverlay"
    >
      <div
        class="w-full h-fit will-change-auto"
        :class="[positionClasses[props.position]]"
        :style="`max-width: ${props.maxWidth}`"
      >
        <div
          class="relative bg-white rounded-2xl shadow-md will-change-auto"
          :class="[notClosureClass]"
        >
          <InlineSvg
            v-if="props.closeButton"
            src="/media/icons/close-icon.svg"
            class="absolute right-5 top-3.5 block w-5 text-gray-600 cursor-pointer transition hover:text-gray-800 hover:scale-110 z-10"
            @click="emit('click:close', true)"
          />
          <header v-if="props.title || slots.header" class="relative py-4 px-8 border-b">
            <slot name="header">
              <h3 class="font-semibold text-xl">{{ props.title }}</h3>
            </slot>
          </header>
          <main class="py-4 px-8"><slot>Main</slot></main>
          <footer
            v-if="props.title || slots.footer"
            class="py-4 px-8 border-t"
            :class="[props.footerClasses]"
          >
            <slot name="footer">Footer</slot>
          </footer>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.animate-scale {
  animation: scale 0.5s linear;
}
.animate-tada {
  animation: tada 0.2s ease;
}

@keyframes tada {
  0% {
    transform: scale(1);
  }
  10%,
  20% {
    transform: scale(0.9) rotate(-3deg);
  }
  30%,
  50%,
  70%,
  90% {
    transform: scale(1.1) rotate(3deg);
  }
  40%,
  60%,
  80% {
    transform: scale(1.1) rotate(-3deg);
  }
  100% {
    transform: scale(1) rotate(0);
  }
}

@keyframes scale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}
</style>
