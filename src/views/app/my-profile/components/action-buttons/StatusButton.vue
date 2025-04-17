<script setup>
import { computed } from 'vue'
import { useProviderService } from '@/core/service/provider.service'
import { asset } from '@/core/utils/utils'

import vTooltip from '@/directives/tooltip.directive'
import InlineSvg from 'vue-inline-svg'
import AppButton from '@/components/ui/app-button/AppButton.vue'

const providerService = useProviderService()

const profile = computed(() => providerService.provider)

const currentStatusData = computed(() => {
  const statusses = {
    A: {
      tooltip: 'userStatusses.active.tooltip',
      iconClasses: 'text-success'
    },
    I: {
      tooltip: 'userStatusses.inactive.tooltip',
      iconClasses: 'text-gray-400'
    }
  }
  return statusses[profile.value.status] || statusses.I
})
</script>

<template>
  <AppButton
    v-bind="{
      icon: true,
      size: 'sm',
      color: 'none',
      class: 'shadow-none'
    }"
  >
    <InlineSvg
      v-tooltip:top="$t(currentStatusData.tooltip)"
      :src="asset('media/icons/success-icon.svg')"
      :class="currentStatusData.iconClasses"
    />
  </AppButton>
</template>
