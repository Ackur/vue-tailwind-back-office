<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { asset } from '@/core/utils/utils'
import { sizeClasses, themeClasses, inputRightPaddingClass } from './app-textarea.config'
import { fieldErrorHandler } from '@/core/utils/fields-rules'
import InlineSvg from 'vue-inline-svg'
import FieldError from '@/components/misc/FieldError.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },
  value: {
    type: [String, Number],
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg'].includes(val)
  },
  theme: {
    type: String,
    default: 'default',
    validator: (val) => ['default', 'secondary', 'outline'].includes(val)
  },
  autocomplete: {
    type: String,
    default: 'off'
  },
  rules: {
    type: [Function, Array],
    default: null
  },
  errorHandlerOn: {
    type: String,
    default: 'change',
    validator: (value) => {
      return value.match(/(blur|change|initial)/)
    }
  },
  resize: {
    type: String,
    default: 'none'
    // /* Keyword values */ none; both; horizontal; vertical; block; inline;
    // /* Global values */ inherit; initial; revert; revert-layer; unset;
  },
  rows: {
    type: [String, Number],
    default: 4
  },
  inputClasess: String,
  placeholder: String,
  readonly: Boolean
})
const emits = defineEmits(['update:modelValue', 'change'])
const slots = defineSlots()
const errorMsg = ref('')
const refs = reactive({})

const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})

const inputThemeClass = computed(() => themeClasses(props.theme, errorMsg.value))

const inputSizeClass = computed(() => sizeClasses[props.size][props.theme])

const showErrorIcon = computed(() => errorMsg.value)
const inputPaddingForIcons = computed(() =>
  inputRightPaddingClass(showErrorIcon.value, slots.append)
)

function onBlur() {
  checkErrorOnBluR()
}
function checkErrorOnBluR() {
  if (props.errorHandlerOn === 'blur' && props.rules) {
    errorHandler()
  }
}
function errorHandler() {
  errorMsg.value = fieldErrorHandler(props.rules, props.modelValue)
  return errorMsg.value
}

watch(
  () => props.modelValue,
  () => {
    if (props.errorHandlerOn !== 'blur' && props.rules) {
      errorHandler()
    }
  }
)

onMounted(() => {
  if (props.errorHandlerOn === 'initial') {
    errorHandler()
  }
})

defineExpose({ rules: props.rules, errorMsg, errorHandler })
</script>

<template>
  <div class="relative w-full">
    <div
      class="relative h-full flex items-center"
      :class="[inputSizeClass.inputWrap, inputThemeClass.inputWrap]"
    >
      <textarea
        :ref="(el) => (refs.input = el)"
        v-model="inputValue"
        v-bind="props.value && { value: props.value }"
        placeholder=" "
        :readonly="props.readonly"
        :autocomplete="props.autocomplete"
        :rows="rows"
        class="peer h-full w-full min-w-[100px] min-h-[40px] leading-tight px-3 py-2 rounded-md bg-transparent shadow placeholder:font-medium placeholder:text-gray-300 outline-0 scrollbar-primary"
        :class="[inputSizeClass.input, inputThemeClass.input, inputClasess, inputPaddingForIcons]"
        :style="[{ resize: props.resize }]"
        @blur="onBlur"
      />
      <label
        v-if="props.placeholder"
        :class="[
          'absolute left-2 transition-all pointer-events-none peer-placeholder-shown:left-3 peer-placeholder-shown:top-2 peer-placeholder-shown:font-semibold ',
          !props.readonly && 'peer-focus:left-2 peer-focus:translate-y-0',
          inputSizeClass.label,
          inputThemeClass.label
        ]"
      >
        {{ props.placeholder }}
      </label>
      <div class="absolute right-0 flex items-center gap-1 pr-3 z-10">
        <div>
          <slot name="append" />
        </div>
        <div v-if="showErrorIcon" class="w-fit">
          <InlineSvg :src="asset('media/icons/info-icon.svg')" class="text-danger" />
        </div>
      </div>
    </div>
    <FieldError :message="errorMsg" />
  </div>
</template>
