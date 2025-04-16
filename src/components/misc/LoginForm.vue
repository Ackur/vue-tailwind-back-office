<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthService } from '@/core/service/auth.service.js'
import { required, minLength, isThisRefsValid } from '@/core/utils/fields-rules.js'
import { useI18n } from 'vue-i18n'
import AppInput from '@/components/ui/app-input/AppInput.vue'
import AppButton from '@/components/ui/app-button/AppButton.vue'

const authService = useAuthService()
const router = useRouter()
const { t } = useI18n()

const refs = reactive({})
const form = reactive({ provider: 'demo', password: 'password' })
const rules = reactive({ required, minLength: (val) => minLength(val, 100) })

const loading = computed(() => authService.loading)

async function onSubmit() {
  const valid = isThisRefsValid(refs)
  if (valid) {
    try {
      await authService.login(form)
      router.push({ name: 'init' })
    } catch (error) {
      error
    }
  }
}
</script>

<template>
  <div class="relative w-full bg-white rounded-2xl shadow-md p-8 pt-12">
    <h1
      class="absolute -top-8 right-1/2 translate-x-1/2 w-fit text-white text-center text-3xl font-semibold rounded-md bg-primary shadow-md px-8 py-2 pb-3"
    >
      {{ t('loginForm.title') }}
    </h1>
    <form class="flex flex-col" @submit.prevent="onSubmit">
      <AppInput
        :ref="(el) => (refs.provider = el)"
        v-model.trim="form.provider"
        :rules="[rules.required]"
        size="lg"
        theme="outline"
        :placeholder="t('loginForm.providerPlaceholder')"
        class="mb-10"
      />
      <AppInput
        :ref="(el) => (refs.password = el)"
        v-model="form.password"
        :rules="[rules.required]"
        size="lg"
        theme="outline"
        :placeholder="t('loginForm.passwordPlaceholder')"
        type="password"
        passwordIcon
      />
      <RouterLink
        to="/forgot-password"
        class="block text-right text-primary font-semibold leading-none transition-all hover:text-primary-darken mt-1 mb-8 ml-auto"
      >
        {{ t('loginForm.forgotPasswordLink') }}
      </RouterLink>
      <AppButton size="lg" type="submit" class="" :loading="loading">{{ t('submit') }}</AppButton>
    </form>
  </div>
</template>
