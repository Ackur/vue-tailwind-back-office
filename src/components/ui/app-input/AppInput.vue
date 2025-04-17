<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { isEmpty } from '@/core/utils/utils'
import { sizeClasses, themeClasses, inputRightPaddingClass } from './app-input.config'
import { fieldErrorHandler } from '@/core/utils/fields-rules'
import InlineSvg from 'vue-inline-svg'
import FieldError from '@/components/misc/FieldError.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },
  type: {
    type: String,
    default: 'text'
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
  passwordIcon: {
    type: Boolean,
    default: false
  },
  inputClasess: String,
  placeholder: String,
  required: Boolean,
  readonly: Boolean,
  clearable: Boolean
})
const emits = defineEmits(['update:modelValue', 'onSearch', 'change'])
const slots = defineSlots()
const inputType = ref('')
const errorMsg = ref('')
const refs = reactive({})

const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})

const inputThemeClass = computed(() => themeClasses(props.theme, errorMsg.value))

const inputSizeClass = computed(() => sizeClasses[props.size][props.theme])

const showPasswordIcon = computed(
  () => props.passwordIcon && !isEmpty(inputValue.value) && props.type === 'password'
)
const showClearableIcon = computed(() => props.clearable && !isEmpty(inputValue.value))
const showErrorIcon = computed(() => errorMsg.value)
const inputPaddingForIcons = computed(() =>
  inputRightPaddingClass(
    showPasswordIcon.value,
    showClearableIcon.value,
    showErrorIcon.value,
    slots.append
  )
)

function onClickClear() {
  inputValue.value = ''
  refs.input.focus()
}
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
function focus() {
  refs.input.focus()
}

watch(
  () => props.modelValue,
  () => {
    if (props.errorHandlerOn !== 'blur' && props.rules) {
      errorHandler()
    }
  }
)
watch(
  () => props.type,
  (val) => {
    inputType.value = val
  },
  { immediate: true }
)

onMounted(() => {
  if (props.errorHandlerOn === 'initial') {
    errorHandler()
  }
})

defineExpose({ rules: props.rules, errorMsg, focus, errorHandler })
</script>

<template>
  <div class="relative w-full">
    <div
      class="relative flex items-center rounded-md bg-white shadow"
      :class="[inputSizeClass.inputWrap, inputThemeClass.inputWrap]"
    >
      <input
        :ref="(el) => (refs.input = el)"
        v-model="inputValue"
        v-bind="props.value && { value: props.value }"
        :type="inputType"
        placeholder=" "
        :readonly="props.readonly"
        :autocomplete="props.autocomplete"
        class="peer h-full w-full px-3 pb-0.5 rounded-md overflow-ellipsis bg-transparent appearance-none placeholder:font-medium placeholder:text-gray-300 outline-0"
        :class="[inputSizeClass.input, inputThemeClass.input, inputClasess, inputPaddingForIcons]"
        @blur="onBlur"
      />
      <label
        v-if="props.placeholder"
        :class="[
          'absolute left-2 transition-all pointer-events-none peer-placeholder-shown:left-3 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:font-semibold ',
          !props.readonly && 'peer-focus:left-2 peer-focus:translate-y-0',
          inputSizeClass.label,
          inputThemeClass.label
        ]"
      >
        {{ props.placeholder }}
        <span v-if="props.required" :class="[inputThemeClass.required]">*</span>
      </label>
      <div class="absolute right-0 flex items-center gap-1 pr-3 z-10">
        <div>
          <slot name="append" />
        </div>
        <div v-if="showClearableIcon" class="w-fit" @click="onClickClear">
          <InlineSvg
            src="/media/icons/close-icon.svg"
            class="w-5 text-gray-500 transition-all cursor-pointer hover:text-gray-600"
          />
        </div>
        <div v-if="showPasswordIcon" class="w-fit">
          <InlineSvg
            :src="`/media/icons/${inputType === 'password' ? 'eye' : 'eye-close'}-icon.svg`"
            class="w-8 h-8 text-primary cursor-pointer select-none"
            @click="inputType = inputType === 'password' ? 'text' : 'password'"
          />
        </div>
        <div v-if="showErrorIcon" class="w-fit">
          <InlineSvg src="/media/icons/info-icon.svg" class="text-danger" />
        </div>
      </div>
    </div>
    <FieldError :message="errorMsg" />
  </div>
</template>
