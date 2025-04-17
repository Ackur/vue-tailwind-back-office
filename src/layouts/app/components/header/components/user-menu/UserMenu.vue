<script setup>
import { ref } from 'vue'
import { useAuthService } from '@/core/service/auth.service'
import { useProviderService } from '@/core/service/provider.service'

import { useRouter } from 'vue-router'
import InlineSvg from 'vue-inline-svg'
import AppDropdown from '@/components/ui/app-dropdown/AppDropdown.vue'
import QuestionModal from '@/components/modals/QuestionModal.vue'
import UserMenuItem from './UserMenuItem.vue'
import UserMenuLanguageItem from './UserMenuLanguageItem.vue'

const authService = useAuthService()
const providerService = useProviderService()
const router = useRouter()

const showConfirmModal = ref(false)

function logout() {
  authService.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <AppDropdown
    :buttonAttrs="{
      icon: true,
      light: true,
      size: 'lg',
      color: 'primary',
      class: 'rounded-lg overflow-hidden h-full w-full min-h-full min-w-full'
    }"
    :offset="[-85, 5]"
    arrow
    dropdownClasses="max-w-[250px] w-full rounded-md"
    class="w-[45px] h-[45px] max-lg:w-[40px] max-lg:!h-[40px]"
  >
    <template #default>
      <span class="text-3xl max-lg:text-2xl">{{
        providerService.provider.name.at(0).toUpperCase()
      }}</span>
    </template>

    <template #dropdown="{ close }">
      <header class="border-b p-4">
        <div class="flex items-center gap-2">
          <div class="h-[42px] max-w-[42px] w-full flex items-center justify-center">
            <InlineSvg src="/media/icons/user-icon.svg" class="w-full h-auto text-secondary" />
          </div>
          <span class="text-xl font-medium leading-none break-all text-gray-500">
            {{ providerService.provider.name }}
          </span>
        </div>
      </header>
      <main class="px-4 py-2">
        <div class="max-h-[250px] overflow-auto scrollbar-primary">
          <UserMenuItem
            v-bind="{
              title: $t('appHeader.userMenu.profile'),
              icon: '/media/icons/user-v3-icon.svg',
              tag: 'RouterLink',
              attrs: { to: '/my-profile' }
            }"
            @click="close"
          />
          <UserMenuLanguageItem />
          <div class="mx-2 my-2 border-b"></div>
          <UserMenuItem
            v-bind="{
              title: $t('appHeader.userMenu.exit'),
              icon: '/media/icons/sign-out-icon.svg',
              tag: 'button'
            }"
            @click="
              () => {
                showConfirmModal = true
                close()
              }
            "
          />
        </div>
      </main>
    </template>
  </AppDropdown>

  <Teleport to="body">
    <QuestionModal
      v-model:show="showConfirmModal"
      :text="$t('appHeader.userMenu.exitQuestion')"
      position="top-right"
      @onApply="logout"
    />
  </Teleport>
</template>
