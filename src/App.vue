<script setup>
import { computed, onMounted, provide } from 'vue'
import { useAuthService } from '@/core/service/auth.service.js'
import { RouterView } from 'vue-router'
import { useEventHub } from '@/composables/eventHub'

import AppNotification from './components/ui/app-notifycation/AppNotification.vue'
import AppLoader from './layouts/app/components/app-loader/AppLoader.vue'

const authService = useAuthService()

const { emitter, emitterEvents } = useEventHub()
provide('emitter', emitter)
provide('emitterEvents', emitterEvents)

const loading = computed(() => !!(!authService.isAuth && authService.userToken))

onMounted(() => {
  document.body.classList.add('font-inter')
})
</script>

<template>
  <AppLoader :show="loading" class="bg-white z-[11]" />
  <RouterView v-slot="{ Component }">
    <Transition mode="out-in">
      <component :is="Component"></component>
    </Transition>
  </RouterView>
  <AppNotification />
</template>
