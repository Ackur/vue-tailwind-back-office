<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { isThisRefsValid, required, email, phone } from '@/core/utils/fields-rules.js'
import { useRouter } from 'vue-router'
import { useUsersService } from '@/core/service/users.service'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import { useI18n } from 'vue-i18n'

import AppInput from '@/components/ui/app-input/AppInput.vue'
import AppButton from '@/components/ui/app-button/AppButton.vue'

const { t } = useI18n()
const props = defineProps({ userData: Object })
const usersService = useUsersService()
const router = useRouter()
const toaster = useNotifications()

const refs = reactive({})
const loading = ref(false)
const form = reactive({
  name: '',
  phone: '',
  email: ''
})
const rules = { required, email: (v) => !v || email(v), phone: (v) => !v || phone(v) }

const hasChanges = computed(() =>
  Object.keys(form).some((key) => form[key] !== props.userData[key])
)

async function submit() {
  const valid = isThisRefsValid(refs)
  if (valid) {
    try {
      loading.value = true
      let needChangePage = false
      if (form.name !== props.userData.name) {
        needChangePage = true
      }
      await usersService.updateUsers({ fields: form })
      toaster.s(t('userProfileForm.successMessage'))
      if (needChangePage) {
        router.push({ name: 'User info', params: { userId: usersService.selectedUser.id } })
      }
    } catch (error) {
      error
    } finally {
      loading.value = false
    }
  }
}
function margeUserData() {
  Object.keys(form).forEach((key) => (form[key] = props.userData[key]))
  Object.values(refs).forEach((ref) => (ref.errorMsg = ''))
}

watch(
  () => props.userData,
  (obj) => {
    if (obj) {
      margeUserData()
    }
  },
  { immediate: true }
)
</script>

<template>
  <form class="w-full flex flex-col gap-6" @submit.prevent="submit">
    <div class="flex gap-6 max-sm:flex-col">
      <AppInput
        :ref="(el) => (refs.name = el)"
        v-model="form.name"
        :rules="[rules.required]"
        :placeholder="$t('userProfileForm.namePlaceholder')"
        theme="secondary"
      />
      <AppInput
        :ref="(el) => (refs.phone = el)"
        v-model="form.phone"
        :rules="[rules.phone]"
        :placeholder="$t('userProfileForm.phonePlaceholder')"
        theme="secondary"
      />
      <AppInput
        :ref="(el) => (refs.email = el)"
        v-model="form.email"
        :rules="[rules.email]"
        :placeholder="$t('userProfileForm.emailPlaceholder')"
        theme="secondary"
      />
    </div>

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
