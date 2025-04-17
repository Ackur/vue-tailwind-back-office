<script setup>
import { reactive, watch } from 'vue'
import { useProviderService } from '@/core/service/provider.service'

import vTooltip from '@/directives/tooltip.directive'
import AppButtonQuestion from '@/components/ui/app-button-question/AppButtonQuestion.vue'
import AppInput from '@/components/ui/app-input/AppInput.vue'

const providerService = useProviderService()

const form = reactive({ minimum: 0, auto_topup: 0 })

function setCurrentValues() {
  form.minimum = providerService.provider.minimum
  form.auto_topup = providerService.provider.auto_topup
}

watch(
  () => providerService.provider,
  (val) => {
    val && setCurrentValues()
  },
  { immediate: true }
)
</script>

<template>
  <AppButtonQuestion
    v-tooltip:top="$t('myProfilePage.tooltips.creditSettings')"
    :buttonAttrs="{
      icon: true,
      light: true,
      size: 'sm',
      color: 'secondary',
      leftIcon: 'media/icons/settings-v2-icon.svg',
      class: 'shadow-sm'
    }"
    actionsClasses="border-none !p-0"
  >
    <template #content>
      <p class="font-normal text-gray-400 text-center mb-4">
        {{ $t('myProfilePage.autoTopUpForm.title') }}
      </p>
      <AppInput
        v-model.number="form.minimum"
        type="number"
        readonly
        :placeholder="$t('myProfilePage.autoTopUpForm.minimumPlaceholder')"
        theme="secondary"
        class="mb-5"
      />
      <AppInput
        v-model.number="form.auto_topup"
        type="number"
        readonly
        :placeholder="$t('myProfilePage.autoTopUpForm.autoTopupPlaceholder')"
        theme="secondary"
      />
    </template>
    <template #actions>
      {{ ' ' }}
    </template>
  </AppButtonQuestion>
</template>
