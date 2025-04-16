<script setup>
import { nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import InlineSvg from 'vue-inline-svg'
import AppButton from '@/components/ui/app-button/AppButton.vue'
import AppDropdown from '@/components/ui/app-dropdown/AppDropdown.vue'

const { te, t } = useI18n()

const props = defineProps({
  placement: String,
  buttonAttrs: Object,
  question: String,
  loading: Boolean,
  dropdownClasses: String,
  actionsClasses: String,
  submitText: { type: String, default: 'submit' },
  cancelText: { type: String, default: 'cancel' }
})
const emits = defineEmits(['cancel', 'submit', 'changeVisible'])

function onCancel(close) {
  close()
  nextTick(() => {
    emits('cancel', close)
  })
}
function onSubmit(close) {
  emits('submit', close)
}
function changeVisible(val) {
  emits('changeVisible', val)
}
</script>

<template>
  <AppDropdown
    :placement="props.placement"
    :buttonAttrs="buttonAttrs"
    arrow
    :dropdownClasses="`bg-white rounded-lg border ${props.dropdownClasses}`"
    @changeVisible="changeVisible"
  >
    <template #button>
      <AppButton v-bind="props.buttonAttrs" class="relative">
        <slot></slot>
      </AppButton>
    </template>
    <template #dropdown="{ close }">
      <form class="px-3 py-2" novalidate @submit.prevent="onSubmit(close)">
        <div class="pb-2">
          <slot name="content" :close="onCancel">
            <h5 class="flex items-center gap-2 font-semibold">
              <InlineSvg
                src="./media/icons/question-circle-icon.svg"
                class="w-full h-full max-w-[30px] text-secondary/60"
              />
              {{ props.question }}
            </h5>
          </slot>
        </div>
        <div
          class="flex items-center justify-end gap-2 border-t pt-2"
          :class="[props.actionsClasses]"
        >
          <slot name="actions">
            <AppButton
              size="sm"
              outline
              light
              color="danger"
              class="min-h-fit"
              @click="onCancel(close)"
            >
              {{ te(props.cancelText) ? t(props.cancelText) : props.cancelText }}
            </AppButton>
            <AppButton
              type="submit"
              size="sm"
              outline
              color="success"
              class="min-h-fit"
              :loading="loading"
            >
              {{ te(props.submitText) ? t(props.submitText) : props.submitText }}
            </AppButton>
          </slot>
        </div>
      </form>
    </template>
  </AppDropdown>
</template>
