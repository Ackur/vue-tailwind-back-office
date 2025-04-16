<template>
  <div class="flex bg-gray-200 text-gray-800">
    <AppAside @onCollapse="contentPadding = $event" />
    <div
      class="w-full flex-auto flex flex-col min-h-screen ease-in-out duration-300"
      :class="[contentPadding]"
    >
      <AppHeader />
      <AppContent />
      <AppFooter />
    </div>

    <Teleport to="body">
      <AddUserModal />
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import AppContent from './components/content/AppContent.vue'
import AppFooter from './components/footer/AppFooter.vue'
import AppHeader from './components/header/AppHeader.vue'
import AppAside from './components/aside/AppAside.vue'
import AddUserModal from '@/views/app/users-list/components/AddUserModal.vue'

const contentPadding = ref('')
</script>
