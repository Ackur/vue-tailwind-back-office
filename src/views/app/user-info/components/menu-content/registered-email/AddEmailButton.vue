<script setup>
import { ref, reactive, nextTick } from 'vue'
import { isThisRefsValid, email } from '@/core/utils/fields-rules.js'
import { useUsersService } from '@/core/service/users.service'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import { useI18n } from 'vue-i18n'

import vTooltip from '@/directives/tooltip.directive'
import InlineSvg from 'vue-inline-svg'
import AppButtonQuestion from '@/components/ui/app-button-question/AppButtonQuestion.vue'
import AppInput from '@/components/ui/app-input/AppInput.vue'

const { t } = useI18n()

const props = defineProps({ emails: Array })

const usersService = useUsersService()
const toaster = useNotifications()

const refs = reactive({})
const loading = ref(false)

const form = reactive({ mail_from: '' })
const rules = {
  email,
  alreadyExists: (v) =>
    !props.emails.map((el) => el.mail_from).includes(v) ||
    t('userRegisteredEmail.whiteList.add.rules.alreadyExists')
}

async function submit(close) {
  const valid = isThisRefsValid(refs)
  if (valid) {
    try {
      loading.value = true
      await usersService.addRegisteredWhitelistEmail(form.mail_from)
      toaster.s(t('userRegisteredEmail.whiteList.add.successMessage'))
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
  setTimeout(() => {
    form.mail_from = ''
  }, 200)
  setTimeout(() => {
    refs.mail_from.errorMsg = ''
  }, 300)
}
function changeVisible(val) {
  if (!val) {
    resetForm()
  } else {
    nextTick(() => {
      refs.mail_from.focus()
    })
  }
}
</script>

<template>
  <AppButtonQuestion
    :buttonAttrs="{
      icon: true,
      light: true,
      size: 'sm',
      color: 'none',
      loading,
      class: 'text-secondary/70 shadow-none hover:text-secondary hover:bg-gray-100'
    }"
    :loading="loading"
    @submit="submit"
    @changeVisible="changeVisible"
  >
    <InlineSvg
      v-tooltip:top="$t('userRegisteredEmail.whiteList.add.tooltip')"
      src="/media/icons/plus-circle-icon.svg"
    />
    <template #content>
      <p class="font-normal text-gray-400 leading-tight">
        {{ $t('userRegisteredEmail.whiteList.add.title') }}
      </p>
      <AppInput
        :ref="(el) => (refs.mail_from = el)"
        v-model.trim="form.mail_from"
        :rules="[rules.email, rules.alreadyExists]"
        theme="secondary"
      />
    </template>
  </AppButtonQuestion>
</template>
