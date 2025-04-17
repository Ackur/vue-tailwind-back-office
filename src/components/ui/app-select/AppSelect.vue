<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { isEmpty, makeid, asset } from '@/core/utils/utils'
import { sizeClasses, themeClasses } from './app-select.config'

import InlineSvg from 'vue-inline-svg'
import vClickOutside from '@/directives/clickOutside'
import PopperComponent from '@/components/misc/popper-component/PopperComponent.vue'

const props = defineProps({
  placeholder: String,
  modelValue: {
    type: [String, Number, Object, Array],
    default: null
  },
  items: {
    type: Array,
    default: () => []
  },
  itemName: {
    type: [String, Number],
    default: 'name',
    description: 'name or name1|name2|name3, look getItemName func'
  },
  itemValue: {
    type: [String, Number],
    default: 'value'
  },
  theme: {
    type: String,
    default: 'default',
    validator: (val) => ['default', 'secondary', 'outline'].includes(val)
  },
  searchable: Boolean,
  clearable: Boolean,
  returnObject: Boolean,
  multiple: Boolean
})

const emits = defineEmits(['update:modelValue', 'onSearch', 'change'])

const dropdownId = makeid()
const refs = reactive({})
const show = ref(false)
const errorMsg = ref('')
const search = ref('')

const inputThemeClass = computed(() =>
  themeClasses(props.theme, errorMsg.value, isEmpty(selectedItem.value))
)

const inputSizeClass = computed(() => sizeClasses[props.size][props.theme])

const selectedItem = computed({
  get() {
    const processingTypes = ['string', 'number']
    if (processingTypes.includes(typeof props.modelValue)) {
      return normalizeItems.value.find((item) => item[props.itemValue] === props.modelValue) || ''
    }
    if (Array.isArray(props.modelValue)) {
      if (processingTypes.includes(typeof props.modelValue.at(0))) {
        return props.modelValue.map((el) =>
          normalizeItems.value.find((item) => item[props.itemValue] === el)
        )
      }
    }
    return props.modelValue
  },
  set(item) {
    const outputValue =
      props.multiple && props.returnObject
        ? item
        : props.multiple && !props.returnObject
        ? item.map((el) => el[props.itemValue])
        : props.returnObject
        ? item
        : item[props.itemValue]
        ? item[props.itemValue]
        : ''
    emits('update:modelValue', outputValue)
  }
})

const normalizeItems = computed(() => {
  const processingTypes = ['string', 'number']
  if (processingTypes.includes(typeof props.items[0])) {
    return props.items.map((el) => ({
      [props.itemName]: el,
      [props.itemValue]: el
    }))
  }

  const result = [...props.items] || []
  return result
})

const listItems = computed(() =>
  normalizeItems.value.filter((el) =>
    String(el[props.itemName]).toLowerCase().includes(search.value.toLowerCase())
  )
)

function getItemName(item) {
  const propItemNames = props.itemName.split('|')
  for (let i = 0; i < propItemNames.length; i++) {
    const name = item && item[propItemNames.at(i)]
    if (name) {
      return name
    }
  }
}

function closeList() {
  show.value = false
}

function onSelect(item) {
  if (itemMatch(item)) return
  selectedItem.value = item
  show.value = false
  emits('change', item)
}

function onClickClear() {
  selectedItem.value = ''
}

function itemMatch(item) {
  if (props.multiple) {
    return selectedItem.value.some((el) => el[props.itemValue] === item[props.itemValue])
  } else {
    return Object.is(item, selectedItem.value)
  }
}

function clickOutside(evt) {
  if (
    !evt.target.closest(`[data-component="${dropdownId}"]`) &&
    !evt.target.closest(`[data-popper="${dropdownId}"]`)
  ) {
    closeList()
  }
}

watch(show, (val) => {
  if (val && props.searchable) {
    search.value = ''
  }
  if (val && refs.search) {
    nextTick(() => {
      refs.search.focus()
    })
  }
})

defineExpose({ errorMsg })
</script>

<template>
  <div
    :ref="(el) => (refs.component = el)"
    :data-component="dropdownId"
    class="w-full relative"
    v-click-outside="clickOutside"
  >
    <div
      class="relative h-10 flex items-center rounded-md shadow"
      :class="[inputThemeClass.select]"
      @click="show = !show"
    >
      <div class="w-full truncate px-3 pb-0.5">
        {{ getItemName(selectedItem) }}
      </div>
      <span
        v-if="props.placeholder"
        class="block absolute text-sm transition-all pointer-events-none"
        :class="[inputThemeClass.label]"
      >
        {{ props.placeholder }}
      </span>
      <div v-if="clearable && !isEmpty(selectedItem)" class="w-fit px-1" @click.stop="onClickClear">
        <InlineSvg
          :src="asset('media/icons/close-icon.svg')"
          class="w-5 text-gray-500 transition-all cursor-pointer hover:text-gray-600"
        />
      </div>
      <div class="w-fit p-2">
        <InlineSvg
          :src="asset('media/icons/arrow-right-v2-icon.svg')"
          width="15"
          class="text-gray-400 rotate-90 transition-all"
          :class="[show && 'rotate-[270deg]']"
        />
      </div>
    </div>

    <Teleport to="body">
      <PopperComponent
        :data-popper="dropdownId"
        :visible="show"
        :dependentRef="refs.component"
        :offset="[0, 3]"
        sameWidth
        disableDefaulShadow
        :wrapClasses="['shadow-lg z-50', inputThemeClass.dropdown]"
      >
        <div class="p-2 pr-1">
          <ul class="pr-1">
            <li v-if="searchable" class="py-1.5">
              <input
                :ref="(el) => (refs.search = el)"
                v-model.trim="search"
                type="search"
                class="sticky top-5 w-full text-sm leading-none rounded-lg outline-none border-2 bg-white px-2 pt-1 pb-1.5"
              />
            </li>
            <li>
              <ul
                class="overflow-auto scrollbar-primary"
                :class="[searchable ? 'max-h-[210px]' : 'max-h-[250px]']"
              >
                <li
                  v-for="(item, idx) in listItems"
                  :key="idx"
                  class="flex items-center text-sm leading-tight cursor-pointer [&:not(:last-child)]:border-b hover:bg-primary/10 px-2 py-1.5"
                  :class="[
                    itemMatch(item) &&
                      'bg-primary/20 hover:bg-primary/20 text-primary font-medium cursor-default'
                  ]"
                  @click="onSelect(item)"
                >
                  {{ getItemName(item) }}
                </li>
              </ul>
            </li>
            <li
              v-if="!listItems.length"
              class="h-8 flex items-center justify-center text-gray-400 text-sm leading-none"
            >
              {{ $t('noData') }}
            </li>
          </ul>
        </div>
      </PopperComponent>
    </Teleport>
  </div>
</template>
