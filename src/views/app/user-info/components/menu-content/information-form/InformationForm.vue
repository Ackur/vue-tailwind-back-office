<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { isThisRefsValid, required } from '@/core/utils/fields-rules.js'
import { useUsersService } from '@/core/service/users.service'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import { useI18n } from 'vue-i18n'
import { countriesList, statesList, timeZonesList } from '@/core/utils/users-utils/info.utils.js'

import AppInput from '@/components/ui/app-input/AppInput.vue'
import AppSelect from '@/components/ui/app-select/AppSelect.vue'
import AppButton from '@/components/ui/app-button/AppButton.vue'
import AppTextarea from '@/components/ui/app-textarea/AppTextarea.vue'

const { t } = useI18n()
const props = defineProps({ userData: Object })
const usersService = useUsersService()
const toaster = useNotifications()

const refs = reactive({})
const loading = ref(false)
const form = reactive({
  contact_name: '',
  company: '',
  cif: '',
  country: '',
  state: '',
  city: '',
  address: '',
  user_tz: '',
  zip: '',
  comment: ''
})
const rules = { required }

const hasChanges = computed(() =>
  Object.keys(form).some((key) => form[key] !== props.userData[key])
)

async function submit() {
  const valid = isThisRefsValid(refs)
  if (valid) {
    try {
      loading.value = true
      const changedFields = Object.entries(form).reduce((acc, [key, value]) => {
        if (value !== props.userData[key]) {
          acc[key] = value
        }
        return acc
      }, {})
      await usersService.updateUsers({ fields: changedFields })
      toaster.s(t('userInfoForm.successMessage'))
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
  <div class="w-full">
    <h4 class="text-lg font-semibold mb-4">{{ $t('userInfoForm.title') }}</h4>
    <form class="flex flex-col gap-6" @submit.prevent="submit">
      <div class="flex flex-col gap-6">
        <div class="flex gap-6 max-md:flex-col">
          <AppInput
            :ref="(el) => (refs.contact_name = el)"
            v-model="form.contact_name"
            :placeholder="$t('userInfoForm.contactNamePlaceholder')"
            theme="secondary"
          />
          <AppInput
            :ref="(el) => (refs.company = el)"
            v-model="form.company"
            :placeholder="$t('userInfoForm.companyPlaceholder')"
            theme="secondary"
          />
          <AppInput
            :ref="(el) => (refs.cif = el)"
            v-model="form.cif"
            :placeholder="$t('userInfoForm.cifPlaceholder')"
            theme="secondary"
          />
        </div>
        <div class="border-b border-dashed"></div>
        <div class="flex flex-col gap-6">
          <div
            class="grid gap-6 max-md:grid-cols-1"
            :class="[form.country === 'Spain' ? 'grid-cols-4' : 'grid-cols-3']"
          >
            <AppSelect
              :ref="(el) => (refs.country = el)"
              v-model="form.country"
              :items="countriesList"
              :placeholder="$t('userInfoForm.countryPlaceholder')"
              theme="secondary"
              searchable
              clearable
            />
            <AppSelect
              v-if="form.country === 'Spain'"
              :ref="(el) => (refs.state = el)"
              v-model="form.state"
              :items="statesList"
              :placeholder="$t('userInfoForm.statePlaceholder')"
              theme="secondary"
              searchable
              clearable
            />
            <AppInput
              :ref="(el) => (refs.city = el)"
              v-model="form.city"
              :placeholder="$t('userInfoForm.cityPlaceholder')"
              theme="secondary"
            />
            <AppSelect
              :ref="(el) => (refs.user_tz = el)"
              v-model="form.user_tz"
              :items="timeZonesList"
              itemName="text"
              itemValue="id"
              :placeholder="$t('userInfoForm.tzPlaceholder')"
              theme="secondary"
              searchable
              clearable
            />
          </div>
          <div class="flex gap-6 max-[480px]:flex-col">
            <AppInput
              :ref="(el) => (refs.address = el)"
              v-model="form.address"
              :placeholder="$t('userInfoForm.addressPlaceholder')"
              theme="secondary"
            />
            <AppInput
              :ref="(el) => (refs.zip = el)"
              v-model="form.zip"
              :placeholder="$t('userInfoForm.zipPlaceholder')"
              theme="secondary"
              class="max-w-[150px] max-[480px]:max-w-full"
            />
          </div>
        </div>
        <div class="border-b border-dashed"></div>
        <div class="flex flex-col gap-6">
          <AppTextarea
            :ref="(el) => (refs.comment = el)"
            v-model="form.comment"
            :placeholder="$t('userInfoForm.commentPlaceholder')"
            theme="secondary"
          />
        </div>
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
  </div>
</template>
