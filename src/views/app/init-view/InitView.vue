<script setup>
import { inject } from 'vue'
import InlineSvg from 'vue-inline-svg'
import LastUsersTable from './components/LastUsersTable.vue'

const emitter = inject('emitter')
const emitterEvents = inject('emitterEvents')

const routeLinkList = [
  {
    icon: './media/icons/users-group-icon.svg',
    text: 'dashboardPage.links.users',
    tag: 'RouterLink',
    attrs: { to: 'users-list' }
  },
  {
    icon: './media/icons/add-user-icon.svg',
    text: 'dashboardPage.links.addNewUser',
    tag: 'button',
    action: () => emitter.emit(emitterEvents.ADD_USER_MODAL_VISIBILITY, true)
  },
  {
    icon: './media/icons/money-icon.svg',
    text: 'dashboardPage.links.topUps',
    tag: 'RouterLink',
    attrs: { to: 'top-ups' }
  },
  {
    icon: './media/icons/contacts-book-icon.svg',
    text: 'dashboardPage.links.profile',
    tag: 'RouterLink',
    attrs: { to: 'my-profile' }
  },
  {
    icon: './media/icons/settings-icon.svg',
    text: 'dashboardPage.links.settings',
    tag: 'RouterLink',
    attrs: { to: 'general-settings' }
  }
]
</script>

<template>
  <div class="h-full w-full flex flex-col items-center">
    <div
      class="w-fit flex items-center justify-center gap-6 border-2 border-dashed rounded-lg p-4 mb-6 mx-auto max-sm:gap-3 max-sm:flex-wrap"
    >
      <template v-for="item in routeLinkList" :key="item.text">
        <component
          :is="item.tag"
          v-bind="item.attrs"
          class="group relative w-24 flex flex-col items-center bg-white rounded-md shadow overflow-hidden transition-shadow delay-150 hover:shadow-primary/50 hover:shadow-lg p-3"
          @click="item.action"
        >
          <div
            class="absolute bottom-0 top-full w-full bg-primary/90 transition-all duration-300 z-0 group-hover:top-0"
          ></div>
          <InlineSvg
            :src="item.icon"
            class="w-10 h-auto text-primary drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)] transition-all duration-300 delay-100 z-[1] group-hover:text-white"
          />
          <span class="transition-all duration-300 delay-100 z-[1] group-hover:text-white">
            {{ $t(item.text) }}
          </span>
        </component>
      </template>
    </div>
    <LastUsersTable />
  </div>
</template>
