<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { isThisRefsValid } from '@/core/utils/fields-rules.js'
import { useUsersService } from '@/core/service/users.service'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import { useI18n } from 'vue-i18n'

import vTooltip from '@/directives/tooltip.directive'
import AppButtonQuestion from '@/components/ui/app-button-question/AppButtonQuestion.vue'
import AppInput from '@/components/ui/app-input/AppInput.vue'

const { t } = useI18n()
const usersService = useUsersService()
const toaster = useNotifications()

const refs = reactive({})
const loading = ref(false)

const form = reactive({ minimum: 0, auto_topup: 0 })
const rules = {
  notEmpty: (v) => v !== '' || t('validators.required'),
  positiveNumber: (v) => v >= 0 || t('validators.positiveNumber')
}

async function submit(close) {
  const valid = isThisRefsValid(refs)
  if (valid) {
    try {
      loading.value = true
      await usersService.updateUsers({ fields: form })
      toaster.s(t('autoTopUpCreditForm.successMessage'))
      close()
      resetForm()
    } catch (error) {
      error
    } finally {
      loading.value = false
    }
  }
}

function resetForm() {
  setCurrentValues()
  nextTick(() => {
    refs.minimum.errorMsg = ''
    refs.auto_topup.errorMsg = ''
  })
}

function setCurrentValues() {
  form.minimum = usersService.selectedUser.minimum
  form.auto_topup = usersService.selectedUser.auto_topup
}

watch(
  usersService.selectedUser,
  (val) => {
    val && setCurrentValues()
  },
  { immediate: true }
)
</script>

<template>
  <AppButtonQuestion
    v-tooltip:top="$t('autoTopUpCreditForm.tooltip')"
    :buttonAttrs="{
      icon: true,
      light: true,
      size: 'sm',
      color: 'secondary',
      leftIcon: 'media/icons/settings-v2-icon.svg',
      class: 'shadow-sm'
    }"
    :loading="loading"
    @submit="submit"
    @cancel="resetForm"
  >
    <template #content>
      <p class="font-normal text-gray-400 mb-2">{{ $t('autoTopUpCreditForm.title') }}</p>
      <AppInput
        :ref="(el) => (refs.minimum = el)"
        v-model.number="form.minimum"
        :rules="[rules.notEmpty, rules.positiveNumber]"
        type="number"
        :placeholder="$t('autoTopUpCreditForm.minimumPlaceholder')"
        theme="secondary"
        class="mb-3"
      />
      <AppInput
        :ref="(el) => (refs.auto_topup = el)"
        v-model.number="form.auto_topup"
        :rules="[rules.notEmpty, rules.positiveNumber]"
        type="number"
        :placeholder="$t('autoTopUpCreditForm.autoTopUpPlaceholder')"
        theme="secondary"
      />
    </template>
  </AppButtonQuestion>
</template>
