<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { isThisRefsValid, required, email, phone, url } from '@/core/utils/fields-rules.js'
import { useUsersService } from '@/core/service/users.service'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import { events, actions, languages } from '@/core/configs/userActions.config.js'
import { useI18n } from 'vue-i18n'
import AppModal from '@/components/ui/app-modal/AppModal.vue'
import AppButton from '@/components/ui/app-button/AppButton.vue'
import AppSelect from '@/components/ui/app-select/AppSelect.vue'
import AppInput from '@/components/ui/app-input/AppInput.vue'

const { t } = useI18n()
const usersService = useUsersService()
const toaster = useNotifications()

const props = defineProps({
  show: { type: Boolean, default: true }
})
const emit = defineEmits(['onApply', 'update:show'])

const langList = languages

const refs = reactive({})
const loading = ref(false)
const initFormState = {
  event: 'MO_SMS',
  action: '',
  number: 'All',
  value: '',
  lang: 'ES'
}
const form = reactive({ ...initFormState })
const rules = { required, email, phone, url }

const eventsList = computed(() => Object.values(events))
const actionsList = computed(() =>
  Object.values(actions).filter((el) => el.events.includes(form.event))
)
const numbersList = computed(() => [t('all'), ...usersService.selectedUser.numbers])
const showPhoneField = computed(() => events[form.event]?.phone)
const showLangField = computed(() => actions[form.action]?.lang)

const showModel = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
})

async function onSubmit() {
  const valid = isThisRefsValid(refs)
  if (valid) {
    try {
      loading.value = true
      await usersService.addUserAction(form)
      toaster.s(t('userActions.addForm.successMessage'))
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
  Object.entries(initFormState).forEach(([key, value]) => {
    if (!['event', 'action'].includes(key)) {
      form[key] = value
    }
  })
  nextTick(() => {
    Object.values(refs).forEach((ref) => {
      if (ref) ref.errorMsg = ''
    })
  })
}

watch(
  actionsList,
  (arr) => {
    if (arr.length) {
      form.action = arr.at(0).id
    } else {
      form.action = ''
      console.log('empty')
    }
    resetForm()
  },
  { immediate: true, flush: 'post' }
)

watch(showModel, (val) => {
  if (!val) resetForm()
})
watch(
  () => form.action,
  () => {
    resetForm()
  }
)
</script>

<template>
  <AppModal
    v-model:show="showModel"
    :title="$t('userActions.addForm.title')"
    max-width="500px"
    @click:close="onClose"
  >
    <template #default>
      <form @submit.prevent="onSubmit" novalidate class="flex flex-col gap-6">
        <AppSelect
          v-model="form.event"
          :items="eventsList"
          itemValue="id"
          itemName="text"
          theme="secondary"
          :placeholder="$t('userActions.addForm.eventPlaceholder')"
        />

        <AppSelect
          v-if="showPhoneField"
          v-model="form.number"
          :items="numbersList"
          theme="secondary"
          :placeholder="$t('userActions.addForm.numberPlaceholder')"
        />

        <AppSelect
          v-if="form.event"
          v-model="form.action"
          :items="actionsList"
          itemValue="id"
          itemName="text"
          theme="secondary"
          :placeholder="$t('userActions.addForm.actionPlaceholder')"
        />

        <AppSelect
          v-if="showLangField"
          v-model="form.lang"
          :items="langList"
          theme="secondary"
          :placeholder="$t('userActions.addForm.langPlaceholder')"
        />

        <AppInput
          :ref="(el) => (refs.value = el)"
          :rules="[rules[actions[form.action].valueRule]]"
          v-model="form.value"
          theme="secondary"
          :placeholder="$t('userActions.addForm.valuePlaceholder')"
        />
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
          {{ $t('confirm') }}
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>
