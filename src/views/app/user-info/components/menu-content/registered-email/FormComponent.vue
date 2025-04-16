<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { isThisRefsValid, required, email } from '@/core/utils/fields-rules.js'
import { useUsersService } from '@/core/service/users.service'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import { languages } from '@/core/configs/userRegisteredEmail.config.js'
import { useI18n } from 'vue-i18n'
import AppButton from '@/components/ui/app-button/AppButton.vue'
import AppInput from '@/components/ui/app-input/AppInput.vue'
import AppSelect from '@/components/ui/app-select/AppSelect.vue'
import AppSwitchBox from '@/components/ui/app-switchbox/AppSwitchBox.vue'

const { t } = useI18n()
const usersService = useUsersService()
const toaster = useNotifications()

const refs = reactive({})
const loading = ref(false)
const defaultFormData = {
  cert_lang: 'ES',
  admin_mail: '',
  send_pdfcpy_from: '0',
  send_pdfcpy_to: '0',
  send_dealpdfcpy_from: '0',
  send_dealpdfcpy_to: '0',
  send_inboxpdfcpy_from: '0',
  send_inboxpdfcpy_to: '0',
  disable_resp_auto: '0'
}
const initialFormData = ref({ ...defaultFormData })
const form = reactive({ ...defaultFormData })
const rules = { required, email: (v) => !v || email(v) }

const user = computed(() => usersService.selectedUser)
const hasChanges = computed(() =>
  Object.keys(form).some((key) => form[key] !== initialFormData.value[key])
)

async function onSubmit() {
  const valid = isThisRefsValid(refs)
  if (valid) {
    try {
      loading.value = true
      const changedFields = Object.entries(form).reduce((acc, [key, value]) => {
        if (value !== initialFormData.value[key]) {
          acc[key] = value
        }
        return acc
      }, {})
      await usersService.setEmailCertificateSettings(changedFields, 'mailcert_settings')
      toaster.s(t('userRegisteredEmail.defaultSettingsForm.successMessage'))
    } catch (error) {
      error
    } finally {
      loading.value = false
    }
  }
}

function margeUserData() {
  Object.keys(form).forEach((key) => (form[key] = initialFormData.value[key]))
  Object.values(refs).forEach((ref) => (ref.errorMsg = ''))
}

watch(
  user,
  (obj) => {
    if (Object.keys(obj.mailcert_settings).length) {
      initialFormData.value = { ...obj.mailcert_settings }
    } else {
      initialFormData.value = { ...defaultFormData }
    }
    margeUserData()
  },
  { immediate: true }
)
</script>

<template>
  <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
    <main class="flex flex-col gap-6">
      <div class="flex gap-6 max-sm:flex-col">
        <AppSelect
          v-model="form.cert_lang"
          :items="languages"
          theme="secondary"
          :placeholder="t('userRegisteredEmail.defaultSettingsForm.langPlaceholder')"
        />
        <AppInput
          :ref="(el) => (email.admin_mail = el)"
          v-model="form.admin_mail"
          :rules="[rules.email]"
          theme="secondary"
          :placeholder="t('userRegisteredEmail.defaultSettingsForm.adminMailPlaceholder')"
        />
      </div>
      <div class="grid grid-cols-2 gap-y-3 gap-x-6 max-sm:grid-cols-1">
        <AppSwitchBox
          v-model="form.send_pdfcpy_from"
          type="switch"
          trueValue="1"
          falseValue="0"
          size="md"
          :label="t('userRegisteredEmail.defaultSettingsForm.sendPdfCpyFromLabel')"
        />
        <AppSwitchBox
          v-model="form.send_pdfcpy_to"
          type="switch"
          trueValue="1"
          falseValue="0"
          size="md"
          :label="t('userRegisteredEmail.defaultSettingsForm.sendPdfCpyToLabel')"
        />
        <AppSwitchBox
          v-model="form.send_dealpdfcpy_from"
          type="switch"
          trueValue="1"
          falseValue="0"
          size="md"
          :label="t('userRegisteredEmail.defaultSettingsForm.sendDealPdfCpyFromLabel')"
        />
        <AppSwitchBox
          v-model="form.send_dealpdfcpy_to"
          type="switch"
          trueValue="1"
          falseValue="0"
          size="md"
          :label="t('userRegisteredEmail.defaultSettingsForm.sendDealPdfCpyToLabel')"
        />
        <AppSwitchBox
          v-model="form.send_inboxpdfcpy_from"
          type="switch"
          trueValue="1"
          falseValue="0"
          size="md"
          :label="t('userRegisteredEmail.defaultSettingsForm.sendInboxPdfCpyFromLabel')"
        />
        <AppSwitchBox
          v-model="form.send_inboxpdfcpy_to"
          type="switch"
          trueValue="1"
          falseValue="0"
          size="md"
          :label="t('userRegisteredEmail.defaultSettingsForm.sendInboxPdfCpyToLabel')"
        />
        <AppSwitchBox
          v-model="form.disable_resp_auto"
          type="switch"
          trueValue="1"
          falseValue="0"
          size="md"
          :label="t('userRegisteredEmail.defaultSettingsForm.disableRespAutoLabel')"
        />
      </div>
    </main>

    <footer class="flex gap-3 justify-end border-t pt-6">
      <Transition
        enter-active-class="transition duration-500"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <AppButton
          v-if="hasChanges"
          color="danger"
          outline
          class="max-w-[150px] w-full"
          @click="margeUserData"
        >
          {{ $t('cancel') }}
        </AppButton>
      </Transition>
      <AppButton
        type="submit"
        color="success"
        outline
        class="max-w-[150px] w-full"
        :disabled="!hasChanges"
        :loading="loading"
      >
        {{ $t('submit') }}
      </AppButton>
    </footer>
  </form>
</template>
