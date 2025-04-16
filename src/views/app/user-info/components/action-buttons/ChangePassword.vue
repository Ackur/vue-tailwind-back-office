<script setup>
import { ref, reactive, nextTick } from 'vue'
import {
  isThisRefsValid,
  minLength,
  containsNumber,
  containsSymbol,
  containsUpperCase,
  containsLowerCase
} from '@/core/utils/fields-rules.js'
import { useUsersService } from '@/core/service/users.service'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import { useI18n } from 'vue-i18n'

import AppButtonQuestion from '@/components/ui/app-button-question/AppButtonQuestion.vue'
import AppInput from '@/components/ui/app-input/AppInput.vue'

const usersService = useUsersService()
const toaster = useNotifications()
const { t } = useI18n()

const refs = reactive({})
const loading = ref(false)

const form = reactive({ userpass: '' })
const rules = {
  containsNumber,
  containsSymbol,
  containsUpperCase,
  containsLowerCase,
  minLength: (v) => minLength(v, 10),
  differentChar: (v) => new Set(v).size > 4 || t('validators.differentChar5'),
  notUsername: (v) => !v?.includes(usersService.selectedUser?.name) || t('validators.notUsername')
}

async function submit(close) {
  const valid = isThisRefsValid(refs)
  if (valid) {
    try {
      loading.value = true
      await usersService.changeUserPassword(form.userpass)
      toaster.s(t('changeUserPasswordForm.successMessage'))
      close()
    } catch (error) {
      error
    } finally {
      loading.value = false
    }
  }
}

function resetForm() {
  form.userpass = ''
  nextTick(() => {
    refs.userpass.errorMsg = ''
  })
}

function changeVisible(val) {
  !val && resetForm()
}
</script>

<template>
  <AppButtonQuestion
    :buttonAttrs="{
      light: true,
      size: 'sm',
      color: 'secondary',
      leftIcon: './media/icons/change-password-icon.svg',
      loading: loading,
      class: 'shadow-sm'
    }"
    :loading="loading"
    dropdownClasses="w-[260px]"
    @changeVisible="changeVisible"
    @submit="submit"
  >
    {{ $t('changeUserPasswordForm.buttonName') }}
    <template #content>
      <p class="font-normal text-gray-400">{{ $t('changeUserPasswordForm.title') }}</p>
      <AppInput
        :ref="(el) => (refs.userpass = el)"
        v-model="form.userpass"
        :rules="[
          rules.containsNumber,
          rules.containsUpperCase,
          rules.containsLowerCase,
          rules.containsSymbol,
          rules.differentChar,
          rules.notUsername,
          rules.minLength
        ]"
        type="password"
        autocomplete="new-password"
        passwordIcon
        theme="secondary"
      />
    </template>
  </AppButtonQuestion>
</template>
