<script>
import ProfileForm from './components/menu-content/ProfileForm.vue'
import InformationForm from './components/menu-content/information-form/InformationForm.vue'
import PhoneNumbersList from './components/menu-content/PhoneNumbersList.vue'
import ActionsTable from './components/menu-content/actions-table/ActionsTable.vue'
import RegisteredEmail from './components/menu-content/registered-email/RegisteredEmail.vue'
import UserStats from './components/menu-content/user-stats/UserStats.vue'

export default {
  components: {
    ProfileForm,
    InformationForm,
    PhoneNumbersList,
    ActionsTable,
    RegisteredEmail,
    UserStats,
    AppMenuTabs
  }
}
</script>

<script setup>
import { ref, computed, watch, nextTick, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUsersService } from '@/core/service/users.service'
import { format } from 'date-fns'

import vTooltip from '@/directives/tooltip.directive'
import InlineSvg from 'vue-inline-svg'
import AddCredit from './components/action-buttons/AddCredit.vue'
import SubtractCredit from './components/action-buttons/SubtractCredit.vue'
import ChangePassword from './components/action-buttons/ChangePassword.vue'
import AutoTopUp from './components/action-buttons/AutoTopUp.vue'
import StatusButton from './components/action-buttons/StatusButton.vue'
import DemoButton from './components/action-buttons/DemoButton.vue'
import AllowToDeleteButton from './components/action-buttons/AllowToDeleteButton.vue'
import AppMenuTabs from '@/components/ui/app-menu-tabs/AppMenuTabs.vue'

const emitter = inject('emitter')
const emitterEvents = inject('emitterEvents')

const props = defineProps({ userId: String })
const usersService = useUsersService()
const router = useRouter()
const route = useRoute()

const user = computed(() => usersService.selectedUser)

const activeUserMenu = ref('ProfileForm')
const userMenu = ref([
  { title: 'userInfoPage.userMenu.profile', value: 'ProfileForm' },
  { title: 'userInfoPage.userMenu.information', value: 'InformationForm' },
  {
    title: 'userInfoPage.userMenu.numbers',
    value: 'PhoneNumbersList'
  },
  { title: 'userInfoPage.userMenu.actions', value: 'ActionsTable' },
  {
    title: 'userInfoPage.userMenu.registeredEmail',
    value: 'RegisteredEmail',
    disaled: computed(() => user.value.mailcert_settings === undefined)
  },
  { title: 'userInfoPage.userMenu.stats', value: 'UserStats' }
])
const menuMoveDirection = ref()

function showViewLoader(val) {
  emitter.emit(emitterEvents.APP_VIEW_LOADER_VISIBILITY, val)
}

async function getUserInfo() {
  try {
    await usersService.getUserInfo(props.userId)
  } catch (error) {
    showViewLoader(false)
    error && router.push({ name: 'Users list' })
  }
}
getUserInfo()

watch(
  user,
  (val) => {
    showViewLoader(!val ? true : false)
  },
  { immediate: true }
)
watch(
  () => route.fullPath,
  () => {
    nextTick(() => {
      usersService.setSelectedUser(null)
    })
  }
)
</script>

<template>
  <div v-if="user" class="w-full max-w-[1300px] mx-auto">
    <div class="bg-white rounded-lg shadow px-6 pt-6 max-sm:px-4 max-sm:pt-4">
      <div class="flex gap-3 pb-6 max-sm:pb-4">
        <div class="w-fit h-fit bg-gray-200 rounded-lg p-1 max-md:hidden">
          <InlineSvg src="/media/icons/user-icon.svg" class="w-20 h-auto" />
        </div>
        <div class="w-full">
          <div class="flex justify-between max-sm:flex-col max-sm:items-center">
            <h3 class="h-fit flex items-center text-xl leading-tight font-semibold">
              <span
                v-tooltip:top="user.name"
                class="max-w-[250px] mr-3 sm:truncate max-sm:break-all"
                >{{ user.name }}</span
              >
              <StatusButton class="mr-1" />
              <DemoButton class="mr-1" />
              <AllowToDeleteButton />
            </h3>
            <div class="flex flex-col gap-1 text-sm font-medium text-gray-400 leading-none">
              <span
                >{{ $t('userInfoPage.header.registration') }}
                {{ format(new Date(user.created), 'dd/MM/yyyy HH:mm') }}</span
              >
              <span
                >{{ $t('userInfoPage.header.lastOperation') }}
                {{ format(new Date(user.lastop), 'dd/MM/yyyy HH:mm') }}</span
              >
            </div>
          </div>

          <div class="flex items-center gap-2 mt-2 max-sm:flex-col">
            <div class="flex items-center gap-2">
              <div
                class="w-fit flex items-center gap-2 border border-dashed rounded-lg leading-none p-2"
              >
                <InlineSvg
                  v-tooltip:top="$t('tooltips.credits')"
                  src="/media/icons/wallet-icon.svg"
                  class="text-secondary"
                />
                <span class="text-xl font-medium">
                  {{ Number(user.credit).toFixed(10) * 1 }}
                </span>
              </div>

              <AddCredit />
              <SubtractCredit v-if="Number(user.credit)" />
              <AutoTopUp />
            </div>

            <ChangePassword class="ml-auto max-sm:ml-0" />
          </div>
        </div>
      </div>

      <AppMenuTabs
        v-model="activeUserMenu"
        :items="userMenu"
        class="overflow-x-auto whitespace-nowrap"
        @moveDirection="menuMoveDirection = $event"
      />
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden p-6 mt-6 max-sm:p-4 max-sm:mt-4">
      <Transition
        enter-active-class="transition duration-500"
        :enter-from-class="
          menuMoveDirection === 'next'
            ? 'translate-x-full opacity-0'
            : '-translate-x-full opacity-0'
        "
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition duration-500"
        leave-from-class="opacity-100 translate-x-0"
        :leave-to-class="
          menuMoveDirection === 'next'
            ? '-translate-x-full opacity-0'
            : 'translate-x-full opacity-0'
        "
        mode="out-in"
      >
        <component :is="activeUserMenu" :userData="user"></component>
      </Transition>
    </div>
  </div>
</template>
