<template>
  <Transition
    enter-active-class="transition duration-500"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-500"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    mode="out-in"
  >
    <div :key="route.path">
      <div v-if="content.title" class="flex items-center gap-2">
        <span class="font-medium">{{ content.title }}</span>
        <template v-if="content.description">
          <span class="h-4 border-r-[1px] border-gray-300"></span>
          <span class="text-sm font-light text-gray-400">{{ content.description }}</span>
        </template>
      </div>

      <div
        v-if="breadcrumbs"
        class="flex items-center gap-1 text-sm text-secondary/70 leading-none"
      >
        <template v-for="(item, idx) in breadcrumbs" :key="item.name">
          <span v-if="idx">-</span>
          <component
            :is="breadcrumbs.length !== idx + 1 ? 'RouterLink' : 'span'"
            v-bind="item.attrs"
            class="transition hover:text-secondary"
            :class="[
              {
                'text-gray-400 hover:text-gray-400 font-light': breadcrumbs.length == idx + 1
              }
            ]"
            >{{ item.name }}</component
          >
        </template>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { tm } = useI18n()
const route = useRoute()

const content = computed(() => {
  return tm('appHeader.titles')[route.name] || {}
})
const breadcrumbs = computed(() => {
  return route.meta.breadcrumbs
})
</script>
