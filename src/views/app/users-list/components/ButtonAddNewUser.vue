<script setup>
import { inject } from 'vue'
import vTooltip from '@/directives/tooltip.directive'
import AppButton from '@/components/ui/app-button/AppButton.vue'

const emitter = inject('emitter')
const emitterEvents = inject('emitterEvents')
</script>

<template>
  <AppButton
    v-tooltip:top="$t('tooltips.add')"
    size="sm"
    light
    icon
    left-icon="./media/icons/plus-icon.svg"
    class="rounded-md"
    @click="emitter.emit(emitterEvents.ADD_USER_MODAL_VISIBILITY, true)"
  ></AppButton>
</template>
