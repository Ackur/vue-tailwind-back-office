<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({ modelValue: String, items: Array })
const emit = defineEmits(['update:modelValue', 'moveDirection'])

const refs = reactive({})
const menuMoveDirection = ref()

const activeItem = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function onClick(item) {
  if (item.disaled) return
  activeItem.value = item.value
}

function setActiveLinePosition(target) {
  if (!refs.activeLine) return
  refs.activeLine.style.width = target.offsetWidth + 'px'
  refs.activeLine.style.left = target.offsetLeft + 'px'
}

watch(
  activeItem,
  (val, oldVal) => {
    const oldValIndex = props.items.findIndex((el) => el.value === oldVal)
    const valIndex = props.items.findIndex((el) => el.value === val)
    menuMoveDirection.value = valIndex > oldValIndex ? 'next' : 'prev'
    emit('moveDirection', menuMoveDirection)
    if (val && refs[val]) {
      setActiveLinePosition(refs[val])
    }
  },
  { immediate: true }
)

watch(
  refs,
  (obj) => {
    if (obj[activeItem.value]) {
      setTimeout(() => {
        setActiveLinePosition(obj[activeItem.value])
      }, 1000)
    }
  },
  { flush: 'post' }
)
</script>

<template>
  <ul class="relative flex">
    <li
      :ref="(el) => (refs[item.value] = el)"
      v-for="item in props.items"
      :key="item.value"
      class="border-b-2 border-transparent cursor-pointer select-none hover:!border-gray-200 px-3 pb-3"
      :class="[item.disaled && 'opacity-50']"
      @click="onClick(item)"
    >
      <span
        class="font-medium text-gray-400 transition-all delay-300"
        :class="[{ '!text-primary': activeItem === item.value }]"
      >
        {{ $te(item.title) ? $t(item.title) : item.title }}
      </span>
    </li>
    <li
      :ref="(el) => (refs.activeLine = el)"
      class="absolute bottom-0 h-0.5 bg-primary rounded-full transition-all duration-500 ease-in-out"
    ></li>
  </ul>
</template>
