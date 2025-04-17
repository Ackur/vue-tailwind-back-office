<script setup>
import { computed } from 'vue'
import { asset } from '@/core/utils/utils'

import InlineSvg from 'vue-inline-svg'
import AppModal from '@/components/ui/app-modal/AppModal.vue'
import AppButton from '@/components/ui/app-button/AppButton.vue'

const props = defineProps({
  show: { type: Boolean, default: true },
  text: String,
  position: String
})
const emit = defineEmits(['onApply', 'update:show'])

const showModel = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
})

function onClose() {
  showModel.value = false
}
function onApply() {
  emit('onApply')
  onClose()
}
</script>

<template>
  <AppModal
    v-model:show="showModel"
    max-width="400px"
    :position="props.position"
    :closeButton="false"
    footerClasses="!py-3 !px-3"
    @click:outside="onClose"
  >
    <div class="flex items-center gap-2 font-medium leading-snug">
      <InlineSvg
        :src="asset('media/icons/question-circle-icon.svg')"
        class="w-10 h-auto text-secondary"
      />
      {{ $te(props.text) ? $t(props.text) : props.text }}
    </div>
    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <AppButton color="success" light size="sm" class="w-20" @click="onApply">{{
          $t('yes')
        }}</AppButton>
        <AppButton color="danger" light size="sm" class="w-20" @click="onClose">{{
          $t('no')
        }}</AppButton>
      </div>
    </template>
  </AppModal>
</template>
