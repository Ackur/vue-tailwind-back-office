<script setup>
import { ref, inject } from 'vue'
import AppLoader from '@/layouts/app/components/app-loader/AppLoader.vue'

const emitter = inject('emitter')
const emitterEvents = inject('emitterEvents')
const loading = ref(false)

emitter.on(emitterEvents.APP_VIEW_LOADER_VISIBILITY, (val) => (loading.value = val))
</script>

<template>
  <main class="relative flex-auto bg-slate-100 p-6 max-lg:p-3">
    <AppLoader :show="loading" class="z-[11] bg-slate-100" />
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Transition
          enter-active-class="animate-fall-right"
          leave-active-class="animate-fall-right-reverse"
          mode="out-in"
        >
          <component :is="Component" class="animation-duration-500" />
        </Transition>
      </template>
    </RouterView>
  </main>
</template>
