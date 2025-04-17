<script setup>
import { ref, computed } from 'vue'
import { useUsersService } from '@/core/service/users.service'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import { useI18n } from 'vue-i18n'

import vTooltip from '@/directives/tooltip.directive'
import InlineSvg from 'vue-inline-svg'
import AppButtonQuestion from '@/components/ui/app-button-question/AppButtonQuestion.vue'

const { t } = useI18n()
const usersService = useUsersService()
const toaster = useNotifications()
const loading = ref(false)

const user = computed(() => usersService.selectedUser)

const currentStatusData = computed(() => {
  const statusses = {
    A: {
      tooltip: 'userStatusses.active.tooltip',
      iconClasses: 'text-success',
      field: 'status',
      value: 'I',
      question: 'userStatusses.active.question',
      successMessage: 'userStatusses.active.successMessage'
    },
    I: {
      tooltip: 'userStatusses.inactive.tooltip',
      iconClasses: 'text-gray-400',
      field: 'status',
      value: 'A',
      question: 'userStatusses.inactive.question',
      successMessage: 'userStatusses.inactive.successMessage'
    }
  }
  return statusses[user.value.status] || statusses.I
})

async function submit(close) {
  try {
    loading.value = true
    const { field, value } = currentStatusData.value
    await usersService.updateUsers({ field, value, usersIds: [user.value.id] })
    toaster.s(t(currentStatusData.value.successMessage))
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
    :question="$t(currentStatusData.question)"
    :loading="loading"
    dropdownClasses="w-[300px]"
    @submit="submit"
  >
    <InlineSvg
      v-tooltip:top="$t(currentStatusData.tooltip)"
      src="/media/icons/success-icon.svg"
      :class="currentStatusData.iconClasses"
    />
  </AppButtonQuestion>
</template>
