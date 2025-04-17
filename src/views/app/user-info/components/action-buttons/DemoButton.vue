<script setup>
import { ref, computed } from 'vue'
import { useUsersService } from '@/core/service/users.service'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import { useI18n } from 'vue-i18n'
import { asset } from '@/core/utils/utils'

import vTooltip from '@/directives/tooltip.directive'
import InlineSvg from 'vue-inline-svg'
import AppButtonQuestion from '@/components/ui/app-button-question/AppButtonQuestion.vue'

const { t } = useI18n()
const usersService = useUsersService()
const toaster = useNotifications()
const loading = ref(false)

const user = computed(() => usersService.selectedUser)

const currentDemoData = computed(() => {
  const statusses = {
    1: {
      tooltip: 'userDemoStatusses.active.tooltip',
      iconClasses: 'text-success',
      field: 'demo',
      value: '0',
      question: 'userDemoStatusses.active.question',
      successMessage: 'userDemoStatusses.active.successMessage'
    },
    0: {
      tooltip: 'userDemoStatusses.inactive.tooltip',
      iconClasses: 'text-gray-400',
      field: 'demo',
      value: '1',
      question: 'userDemoStatusses.inactive.question',
      successMessage: 'userDemoStatusses.inactive.successMessage'
    }
  }
  return statusses[user.value.demo] || statusses[0]
})

async function submit(close) {
  try {
    loading.value = true
    const { field, value } = currentDemoData.value
    await usersService.updateUsers({ field, value, usersIds: [user.value.id] })
    toaster.s(t(currentDemoData.value.successMessage))
    close()
  } catch (error) {
    error
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppButtonQuestion
    :buttonAttrs="{
      icon: true,
      size: 'sm',
      color: 'none',
      class: 'shadow-none hover:bg-gray-100'
    }"
    :submitText="$t('yes')"
    :cancelText="$t('no')"
    :question="$t(currentDemoData.question)"
    :loading="loading"
    dropdownClasses="w-[300px]"
    @submit="submit"
  >
    <InlineSvg
      v-tooltip:top="$t(currentDemoData.tooltip)"
      :src="asset('media/icons/demo-icon.svg')"
      :class="currentDemoData.iconClasses"
    />
  </AppButtonQuestion>
</template>
