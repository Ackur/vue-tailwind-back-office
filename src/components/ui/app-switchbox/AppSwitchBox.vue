<script setup>
import { computed } from 'vue'
import { asset } from '@/core/utils/utils'

import InlineSvg from 'vue-inline-svg'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Boolean],
    default: false
  },
  trueValue: {
    type: [String, Number, Object, Boolean],
    default: true
  },
  falseValue: {
    type: [String, Number, Object, Boolean],
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => {
      return value.match(/(sm|md|lg)/)
    }
  },
  type: {
    type: String,
    default: 'switch',
    validator: (value) => {
      return value.match(/(switch|checkbox)/)
    }
  },
  labelClasses: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])
const slots = defineSlots()

const styleClasses = {
  switch: {
    customInput: 'flex items-center rounded-full',
    customInputCheck: 'bg-success/30',
    customInputUncheck: 'bg-gray-300',
    inputCheckElement: 'absolute rounded-full shadow',
    inputCheckElementCheck: 'bg-success',
    inputCheckElementUncheck: 'bg-white',
    size: {
      sm: {
        customInput: 'w-7 h-4',
        inputCheckElement: 'h-3 w-3',
        inputCheckElementCheck: 'left-[calc(100%-3px)] -translate-x-full',
        inputCheckElementUncheck: 'left-[3px]'
      },
      md: {
        customInput: 'w-full max-w-[2.75rem] h-6',
        inputCheckElement: 'w-4 h-4',
        inputCheckElementCheck: 'left-[calc(100%-4px)] -translate-x-full',
        inputCheckElementUncheck: 'left-[4px]'
      },
      lg: {
        customInput: 'w-14 h-8',
        inputCheckElement: 'w-6 h-6',
        inputCheckElementCheck: 'left-[calc(100%-4px)] -translate-x-full',
        inputCheckElementUncheck: 'left-[4px]'
      }
    }
  },
  checkbox: {
    customInput: 'p-1 flex items-center justify-center rounded border',
    customInputCheck: 'bg-secondary border-secondary',
    customInputUncheck: 'bg-white border-gray-300',
    inputCheckElement: 'text-white',
    inputCheckElementCheck: '',
    inputCheckElementUncheck: 'scale-50',
    size: {
      sm: {
        customInput: 'w-5 h-5',
        inputCheckElement: '',
        inputCheckElementCheck: '',
        inputCheckElementUncheck: ''
      },
      md: {
        customInput: 'w-6 h-6',
        inputCheckElement: '',
        inputCheckElementCheck: '',
        inputCheckElementUncheck: ''
      },
      lg: {
        customInput: 'w-8 h-8',
        inputCheckElement: '',
        inputCheckElementCheck: '',
        inputCheckElementUncheck: ''
      }
    }
  }
}

const inputValue = computed({
  get() {
    if (Array.isArray(props.modelValue)) {
      const value = props.modelValue.find((el) => el === props.trueValue)
      return value ? true : false
    }
    return props.modelValue === props.trueValue
      ? true
      : props.modelValue === props.falseValue
      ? false
      : console.error(
          `checkbox value is invalid, expected ${props.trueValue} or ${props.falseValue}`
        )
  },
  set(val) {
    let emitValue = null
    if (Array.isArray(props.modelValue)) {
      const index = props.modelValue.findIndex((el) => el === props.trueValue)
      if (index > -1) {
        const modelValueCopy = [...props.modelValue]
        modelValueCopy.splice(index, 1)
        emitValue = modelValueCopy
      } else {
        emitValue = [...props.modelValue, props.trueValue]
      }
    } else {
      emitValue =
        val === true
          ? props.trueValue
          : val === false
          ? props.falseValue
          : console.error(
              `checkbox value is invalid, expected ${props.trueValue} or ${props.falseValue}`
            )
    }

    emit('update:modelValue', emitValue)
  }
})

function onChange(evt) {
  emit('change', evt.target.checked)
}
</script>

<template>
  <label class="flex items-center gap-2 select-none">
    <div
      class="relative shadow-sm cursor-pointer ease-in-out duration-300"
      :class="[
        styleClasses[props.type].customInput,
        inputValue
          ? styleClasses[props.type].customInputCheck
          : styleClasses[props.type].customInputUncheck,
        styleClasses[props.type].size[props.size].customInput
      ]"
    >
      <input
        v-model="inputValue"
        :value="props.trueValue"
        type="checkbox"
        class="hidden"
        @change="onChange"
      />
      <div
        class="ease-in-out duration-300"
        :class="[
          styleClasses[props.type].inputCheckElement,
          styleClasses[props.type].size[props.size].inputCheckElement,
          inputValue
            ? styleClasses[props.type].inputCheckElementCheck
            : styleClasses[props.type].inputCheckElementUncheck,
          inputValue
            ? styleClasses[props.type].size[props.size].inputCheckElementCheck
            : styleClasses[props.type].size[props.size].inputCheckElementUncheck
        ]"
      >
        <InlineSvg
          v-if="props.type === 'checkbox' && inputValue"
          :src="asset('media/icons/check-v2-icon.svg')"
          class="w-5"
        />
      </div>
    </div>
    <span v-if="slots.default || label" class="text-sm leading-none">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>
