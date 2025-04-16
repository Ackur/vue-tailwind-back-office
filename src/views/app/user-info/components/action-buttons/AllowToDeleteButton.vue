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

const currentPermissionData = computed(() => {
  const options = {
    1: {
      tooltip: 'userAllowToDeleteStatusses.active.tooltip',
      iconClasses: 'text-success',
      field: 'candelete',
      value: '0',
      question: 'userAllowToDeleteStatusses.active.question',
      successMessage: 'userAllowToDeleteStatusses.active.successMessage'
    },
    0: {
      tooltip: 'userAllowToDeleteStatusses.inactive.tooltip',
      iconClasses: 'text-gray-400',
      field: 'candelete',
      value: '1',
      question: 'userAllowToDeleteStatusses.inactive.question',
      successMessage: 'userAllowToDeleteStatusses.inactive.successMessage'
    }
  }
  return options[user.value.candelete] || options[0]
})

async function submit(close) {
  try {
    loading.value = true
    const { field, value } = currentPermissionData.value
    await usersService.updateUsers({ field, value, usersIds: [user.value.id] })
    toaster.s(t(currentPermissionData.value.successMessage))
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
    :question="$t(currentPermissionData.question)"
    :loading="loading"
    dropdownClasses="w-[300px]"
    @submit="submit"
  >
    <InlineSvg
      v-tooltip:top="$t(currentPermissionData.tooltip)"
      src="./media/icons/eraser-icon.svg"
      :class="currentPermissionData.iconClasses"
    />
  </AppButtonQuestion>
</template>
