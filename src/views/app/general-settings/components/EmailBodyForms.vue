<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import { useProviderService } from '@/core/service/provider.service'
import { isThisRefsValid, required } from '@/core/utils/fields-rules.js'
import { useI18n } from 'vue-i18n'
import AppButton from '@/components/ui/app-button/AppButton.vue'
import AppMenuTabs from '@/components/ui/app-menu-tabs/AppMenuTabs.vue'
import AppTextarea from '@/components/ui/app-textarea/AppTextarea.vue'

const { t } = useI18n()
const providerService = useProviderService()
const toaster = useNotifications()

const refs = reactive({})
const loading = ref(false)
const form = reactive({ emailBody: '' })
const rules = { required }
const activeBodyMenu = ref('message_delivered')
const menuMoveDirection = ref()

const emailBodyConfig = computed(() => providerService.provider.delivery_receipt_conf || {})
const bodyMenu = computed(() => providerService.emailBodyOptions)
const hasChanges = computed(() => form.emailBody !== emailBodyConfig.value[activeBodyMenu.value])

async function submit() {
  const valid = isThisRefsValid(refs)
  if (valid) {
    try {
      loading.value = true
      await providerService.setProviderEmailBodySettings({
        body: form.emailBody,
        type: activeBodyMenu.value
      })
      toaster.s(t('generalSettingsPage.emailBody.successMessage'))
    } catch (error) {
      error
    } finally {
      loading.value = false
    }
  }
}
function margeUserData() {
  form.emailBody = emailBodyConfig.value[activeBodyMenu.value]
  Object.values(refs).forEach((ref) => {
    ref && (ref.errorMsg = '')
  })
}

watch(
  activeBodyMenu,
  (val) => {
    if (val) {
      margeUserData()
    }
  },
  { immediate: true }
)
</script>

<template>
  <AppMenuTabs
    v-model="activeBodyMenu"
    :items="bodyMenu"
    class="overflow-x-auto whitespace-nowrap mt-6 mb-3"
    @moveDirection="menuMoveDirection = $event"
  />
  <div class="relative h-[400px] overflow-hidden">
    <Transition
      enter-active-class="transition duration-1000 ease-[cubic-bezier(0.215,0.610,0.355,1.000)] will-change-transform"
      :enter-from-class="menuMoveDirection === 'next' ? 'translate-x-full' : '-translate-x-full'"
      enter-to-class=""
      leave-active-class="transition duration-1000 ease-[cubic-bezier(0.215,0.610,0.355,1.000)] will-change-transform"
      leave-from-class=""
      :leave-to-class="
        menuMoveDirection === 'next' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'
      "
    >
      <form :key="activeBodyMenu" class="absolute inset-0" @submit.prevent="submit">
        <AppTextarea
          :ref="(el) => (refs.emailBody = el)"
          v-model="form.emailBody"
          :rules="[rules.required]"
          rows="16"
          theme="secondary"
        />

        <footer class="flex gap-3 justify-end pt-4">
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
    </Transition>
  </div>
</template>
