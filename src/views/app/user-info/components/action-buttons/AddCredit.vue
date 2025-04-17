<script setup>
import { ref, reactive, computed } from 'vue'
import { isThisRefsValid } from '@/core/utils/fields-rules.js'
import { useUsersService } from '@/core/service/users.service'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import { useI18n } from 'vue-i18n'

import vTooltip from '@/directives/tooltip.directive'
import InlineSvg from 'vue-inline-svg'
import AppButtonQuestion from '@/components/ui/app-button-question/AppButtonQuestion.vue'
import AppInput from '@/components/ui/app-input/AppInput.vue'

const { t } = useI18n()
const usersService = useUsersService()
const toaster = useNotifications()

const refs = reactive({})
const loading = ref(false)

const form = reactive({ credit: 1 })
const rules = {
  greaterThanZero: (v) => (v && !isNaN(Number(v)) && v > 0) || t('validators.greaterThanZeros')
}

const user = computed(() => usersService.selectedUser)

async function submit(close) {
  const valid = isThisRefsValid(refs)
  if (valid) {
    try {
      loading.value = true
      await usersService.addUserCredit({
        value: form.credit,
        usersId: user.value.id
      })
      toaster.s(t('addCreditForm.successMessage'))
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
  form.credit = 1
}
</script>

<template>
  <AppButtonQuestion
    :buttonAttrs="{
      icon: true,
      light: true,
      size: 'sm',
      color: 'secondary',
      class: 'shadow-sm'
    }"
    :loading="loading"
    @submit="submit"
    @cancel="resetForm"
  >
    <InlineSvg
      v-tooltip:top="$t('tooltips.addCredit')"
      src="/media/icons/plus-circle-icon.svg"
      class=""
    />
    <template #content>
      <p class="font-normal text-gray-400 leading-tight">{{ $t('addCreditForm.title') }}</p>
      <AppInput
        :ref="(el) => (refs.credit = el)"
        v-model.number="form.credit"
        :rules="[rules.greaterThanZero]"
        type="number"
        theme="secondary"
      />
    </template>
  </AppButtonQuestion>
</template>
