<script setup>
import { reactive, computed, nextTick } from 'vue'
import { useAuthService } from '@/core/service/auth.service.js'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import {
  required,
  minLength,
  containsNumber,
  containsSymbol,
  containsUpperCase,
  containsLowerCase,
  passwordsMatch,
  isThisRefsValid
} from '@/core/utils/fields-rules.js'
import { useI18n } from 'vue-i18n'
import AppInput from '@/components/ui/app-input/AppInput.vue'
import AppButton from '@/components/ui/app-button/AppButton.vue'

const authService = useAuthService()
const toaster = useNotifications()
const { t, tm } = useI18n()

const refs = reactive({})
const form = reactive({
  provider: '',
  password: '',
  password_confirm: ''
})
const rules = reactive({
  required,
  containsNumber,
  containsSymbol,
  containsUpperCase,
  containsLowerCase,
  minLength: (v) => minLength(v, 10),
  passwordsMatch: (v) => passwordsMatch(v, form.password),
  differentChar: (v) => new Set(v).size > 4 || t('validators.differentChar5'),
  notUsername: (v) => !v?.includes(form.provider) || t('validators.notUsername')
})

const loading = computed(() => authService.loading)

async function onSubmit() {
  const valid = isThisRefsValid(refs)
  if (valid) {
    try {
      await authService.forgotPassword(form)
      toaster.i(t('forgotPasswordForm.successfulSendingRequestMessage'), '', {
        timer: 0,
        wrapClass: 'max-w-[450px]',
        textClass: 'text-white leading-tight',
        iconClass: 'w-8 h-auto min-w-[2rem]'
      })
      resetForm()
    } catch (error) {
      error
    }
  }
}

function resetForm() {
  Object.keys(form).forEach((key) => {
    form[key] = ''
  })
  nextTick(() => {
    Object.values(refs).forEach((ref) => {
      ref.errorMsg = ''
    })
  })
}
</script>

<template>
  <div class="relative w-full bg-white rounded-2xl shadow-md p-8 pt-9">
    <h1
      class="absolute -top-7 right-1/2 translate-x-1/2 w-fit text-white text-center text-2xl font-semibold whitespace-nowrap rounded-md bg-primary shadow-md px-8 py-2"
    >
      {{ t('forgotPasswordForm.title') }}
    </h1>
    <p
      class="w-fit rounded-md border-2 border-dashed text-center leading-tight text-gray-400 font-medium p-2 mb-4 mx-auto"
    >
      {{ tm('forgotPasswordForm.description').at(0) }}
      <br />
      {{ tm('forgotPasswordForm.description').at(1) }}
    </p>
    <form @submit.prevent="onSubmit">
      <div class="flex flex-col gap-6 mb-4">
        <AppInput
          :ref="(el) => (refs.provider = el)"
          v-model.trim="form.provider"
          :rules="[rules.required]"
          size="lg"
          theme="outline"
          :placeholder="t('forgotPasswordForm.providerPlaceholder')"
          autocomplete="username"
        />
        <AppInput
          :ref="(el) => (refs.password = el)"
          v-model="form.password"
          :rules="[
            rules.containsNumber,
            rules.containsUpperCase,
            rules.containsLowerCase,
            rules.containsSymbol,
            rules.differentChar,
            rules.minLength,
            rules.notUsername
          ]"
          size="lg"
          theme="outline"
          :placeholder="t('forgotPasswordForm.passwordPlaceholder')"
          type="password"
          autocomplete="new-password"
          passwordIcon
        />
        <AppInput
          :ref="(el) => (refs.password_confirm = el)"
          v-model="form.password_confirm"
          :rules="[rules.required, rules.passwordsMatch]"
          size="lg"
          theme="outline"
          :placeholder="t('forgotPasswordForm.confirmPasswordPlaceholder')"
          type="password"
          autocomplete="new-password"
          passwordIcon
        />
        <AppButton size="lg" type="submit" :loading="loading">{{ t('submit') }}</AppButton>
      </div>
      <RouterLink
        to="/login"
        class="w-fit block text-primary font-semibold leading-none transition-all hover:text-primary-darken mx-auto"
      >
        {{ t('forgotPasswordForm.backLink') }}
      </RouterLink>
    </form>
  </div>
</template>
