<script setup>
import { ref, reactive, computed, watch, nextTick, inject } from 'vue'
import {
  isThisRefsValid,
  required,
  email,
  phone,
  minLength,
  containsNumber,
  containsSymbol,
  containsUpperCase,
  containsLowerCase
} from '@/core/utils/fields-rules.js'
import { useUsersService } from '@/core/service/users.service'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import { countriesList, statesList, timeZonesList } from '@/core/utils/users-utils/info.utils.js'
import AppModal from '@/components/ui/app-modal/AppModal.vue'
import AppButton from '@/components/ui/app-button/AppButton.vue'
import AppSelect from '@/components/ui/app-select/AppSelect.vue'
import AppInput from '@/components/ui/app-input/AppInput.vue'
import AppTextarea from '@/components/ui/app-textarea/AppTextarea.vue'

const usersService = useUsersService()
const toaster = useNotifications()
const emitter = inject('emitter')
const emitterEvents = inject('emitterEvents')

emitter.on(emitterEvents.ADD_USER_MODAL_VISIBILITY, (val) => (showModel.value = val))

const refs = reactive({})
const show = ref(false)
const loading = ref(false)
const initFormState = {
  name: '',
  userpass: '',
  email: '',
  phone: '',
  credit: '',
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
}
const form = reactive({ ...initFormState })
const rules = {
  required,
  email: (v) => !v || email(v),
  phone: (v) => !v || phone(v),
  containsNumber,
  containsSymbol,
  containsUpperCase,
  containsLowerCase,
  minLength: (v) => minLength(v, 10),
  differentChar: (v) => new Set(v).size > 4 || 'minimum 5 different characters',
  notUsername: (v) => !form.name.includes(v) || 'not the same as name'
}

const showModel = computed({
  get: () => show.value,
  set: (val) => (show.value = val)
})

async function onSubmit() {
  const valid = isThisRefsValid(refs)
  if (valid) {
    try {
      loading.value = true
      await usersService.createUser(form)
      toaster.s('User created successfully')
      onClose()
    } catch (error) {
      error
    } finally {
      loading.value = false
    }
  }
}

function onClose() {
  showModel.value = false
}

function resetForm() {
  Object.entries(initFormState).forEach(([key, value]) => (form[key] = value))
  nextTick(() => {
    Object.values(refs).forEach((ref) => {
      if (ref) ref.errorMsg = ''
    })
  })
}

watch(showModel, (val) => {
  if (!val) resetForm()
})
</script>

<template>
  <AppModal
    v-model:show="showModel"
    title="Add new user"
    position="top"
    max-width="900px"
    @click:close="onClose"
  >
    <template #default>
      <form @submit.prevent="onSubmit" class="flex flex-col gap-6">
        <div class="grid grid-cols-6 gap-6 max-sm:grid-cols-1">
          <AppInput
            :ref="(el) => (refs.name = el)"
            v-model="form.name"
            :rules="[rules.required]"
            theme="secondary"
            placeholder="Username"
            class="col-span-2 max-md:col-span-3"
          />

          <AppInput
            :ref="(el) => (refs.userpass = el)"
            v-model="form.userpass"
            type="password"
            :rules="[
              rules.containsNumber,
              rules.containsUpperCase,
              rules.containsLowerCase,
              rules.containsSymbol,
              rules.differentChar,
              rules.notUsername,
              rules.minLength
            ]"
            theme="secondary"
            passwordIcon
            autocomplete="new-password"
            placeholder="User password"
            class="col-span-2 max-md:col-span-3"
          />
          <AppInput
            :ref="(el) => (refs.credit = el)"
            v-model="form.credit"
            type="number"
            :rules="[rules.required]"
            theme="secondary"
            placeholder="Credits"
            class="col-span-2 max-md:col-span-3"
          />
          <AppInput
            :ref="(el) => (refs.email = el)"
            v-model="form.email"
            :rules="[rules.email]"
            theme="secondary"
            placeholder="Email"
            class="col-span-3"
          />
          <AppInput
            :ref="(el) => (refs.phone = el)"
            v-model="form.phone"
            :rules="[rules.phone]"
            theme="secondary"
            placeholder="Telephone"
            class="col-span-3"
          />
        </div>

        <div class="border-b border-dashed"></div>

        <div class="flex flex-col gap-6">
          <div class="flex gap-6 max-md:flex-col">
            <AppInput
              :ref="(el) => (refs.contact_name = el)"
              v-model="form.contact_name"
              placeholder="Contact person"
              theme="secondary"
            />
            <AppInput
              :ref="(el) => (refs.company = el)"
              v-model="form.company"
              placeholder="Company"
              theme="secondary"
            />
            <AppInput
              :ref="(el) => (refs.cif = el)"
              v-model="form.cif"
              placeholder="ID"
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
                placeholder="Country"
                theme="secondary"
                searchable
                clearable
              />
              <AppSelect
                v-if="form.country === 'Spain'"
                :ref="(el) => (refs.state = el)"
                v-model="form.state"
                :items="statesList"
                placeholder="County/State"
                theme="secondary"
                searchable
                clearable
              />
              <AppInput
                :ref="(el) => (refs.city = el)"
                v-model="form.city"
                placeholder="City/Town"
                theme="secondary"
              />
              <AppSelect
                :ref="(el) => (refs.user_tz = el)"
                v-model="form.user_tz"
                :items="timeZonesList"
                itemName="text"
                itemValue="id"
                placeholder="Time zone"
                theme="secondary"
                searchable
                clearable
              />
            </div>
            <div class="flex gap-6 max-[480px]:flex-col">
              <AppInput
                :ref="(el) => (refs.address = el)"
                v-model="form.address"
                placeholder="Address"
                theme="secondary"
              />
              <AppInput
                :ref="(el) => (refs.zip = el)"
                v-model="form.zip"
                placeholder="Zip Code"
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
              placeholder="Comment"
              theme="secondary"
            />
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <!-- <AppButton color="danger" light size="md" class="w-28" @click="onClose">No</AppButton> -->
        <AppButton
          color="success"
          light
          size="md"
          class="w-28"
          :loading="loading"
          @click="onSubmit"
        >
          Confirm
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>
