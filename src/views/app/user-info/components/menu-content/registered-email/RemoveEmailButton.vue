<script setup>
import { ref } from 'vue'
import { useUsersService } from '@/core/service/users.service'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import { useI18n } from 'vue-i18n'
import { asset } from '@/core/utils/utils'

import InlineSvg from 'vue-inline-svg'
import AppButtonQuestion from '@/components/ui/app-button-question/AppButtonQuestion.vue'

const { t } = useI18n()
const usersService = useUsersService()
const toaster = useNotifications()

const props = defineProps({ mail_from: String })

const loading = ref(false)

async function removeSubmit(close) {
  try {
    loading.value = true
    await usersService.removeRegisteredWhitelistEmail(props.mail_from)
    toaster.s(t('userRegisteredEmail.whiteList.remove.successMessage'))
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
      loading,
      class: 'text-danger/70 shadow-none hover:text-danger hover:bg-gray-100'
    }"
    submitText="yes"
    cancelText="no"
    :question="$t('userRegisteredEmail.whiteList.remove.question')"
    :loading="loading"
    dropdownClasses="w-[300px]"
    @submit="removeSubmit"
  >
    <InlineSvg :src="asset('media/icons/dustbin-icon.svg')" />
  </AppButtonQuestion>
</template>
