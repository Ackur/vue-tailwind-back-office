<script>
import ProfileForm from './components/ProfileDetails.vue'

export default {
  components: { ProfileForm }
}
</script>

<script setup>
import { ref, computed } from 'vue'
import { useProviderService } from '@/core/service/provider.service'

import { format } from 'date-fns'

import vTooltip from '@/directives/tooltip.directive'
import InlineSvg from 'vue-inline-svg'
import AutoTopUp from './components/action-buttons/AutoTopUp.vue'
import StatusButton from './components/action-buttons/StatusButton.vue'
import AppMenuTabs from '@/components/ui/app-menu-tabs/AppMenuTabs.vue'

const providerService = useProviderService()

const profile = computed(() => providerService.provider)

const activeProfileMenu = ref('ProfileForm')
const profileMenu = ref([{ title: 'profile', value: 'ProfileForm' }])
const menuMoveDirection = ref()
</script>

<template>
  <div v-if="profile" class="w-full max-w-[1300px] mx-auto">
    <div class="bg-white rounded-lg shadow px-6 pt-6 max-sm:px-4 max-sm:pt-4 mb-6 max-sm:mb-4">
      <div class="flex gap-3 pb-6 max-sm:pb-4">
        <div class="w-fit h-fit bg-gray-200 rounded-lg p-1 max-md:hidden">
          <InlineSvg src="/media/icons/user-icon.svg" class="w-20 h-auto" />
        </div>
        <div class="w-full">
          <div class="flex justify-between max-sm:flex-col max-sm:items-center">
            <h3 class="h-fit flex items-center text-xl leading-tight font-semibold">
              <span
                v-tooltip:top="profile.name"
                class="max-w-[250px] sm:truncate max-sm:break-all"
                >{{ profile.name }}</span
              >
              <StatusButton />
            </h3>
            <div class="flex flex-col gap-1 text-sm font-medium text-gray-400 leading-none">
              <span>{{ $t('myProfilePage.registration') }} {{ format(new Date(profile.created), 'dd/MM/yyyy HH:mm') }}</span>
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
                  {{ Number(profile.credit).toFixed(10) * 1 }}
                </span>
              </div>

              <AutoTopUp />
            </div>
          </div>
        </div>
      </div>

      <AppMenuTabs
        v-model="activeProfileMenu"
        :items="profileMenu"
        class="overflow-x-auto whitespace-nowrap"
        @moveDirection="menuMoveDirection = $event"
      />
    </div>

    <Transition
      enter-active-class="transition duration-500"
      :enter-from-class="
        menuMoveDirection === 'next' ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0'
      "
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition duration-500"
      leave-from-class="opacity-100 translate-x-0"
      :leave-to-class="
        menuMoveDirection === 'next' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'
      "
      mode="out-in"
    >
      <component :is="activeProfileMenu"></component>
    </Transition>
  </div>
</template>
