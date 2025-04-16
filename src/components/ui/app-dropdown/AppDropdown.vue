<script setup>
import { ref, watch } from 'vue'
import { makeid } from '@/core/utils/utils.js'
import vClickOutside from '@/directives/clickOutside'
import InlineSvg from 'vue-inline-svg'
import AppButton from '@/components/ui/app-button/AppButton.vue'
import PopperComponent from '@/components/misc/popper-component/PopperComponent.vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  buttonAttrs: Object,
  dropdownClasses: String,
  placement: { type: String, default: 'bottom' },
  offset: { type: Array, default: () => [0, 0] },
  sameWidth: { type: Boolean, default: false },
  disableDefaulShadow: { type: Boolean, default: false },
  arrow: { type: Boolean, default: false },
  itemName: {
    type: [String, Number],
    default: 'title',
    description: 'name or name1|name2|name3, look getItemName func'
  }
})
const dropdownId = makeid()
const emits = defineEmits(['changeVisible'])

const dependentRef = ref()
const dropdownVisible = ref(false)

function dropdownToogle() {
  dropdownVisible.value = !dropdownVisible.value
}
function dropdownClose() {
  if (dropdownVisible.value) {
    dropdownVisible.value = false
  }
}
function getItemName(item) {
  const propItemNames = props.itemName.split('|')
  for (let i = 0; i < propItemNames.length; i++) {
    const name = item && item[propItemNames.at(i)]
    if (name) {
      return name
    }
  }
}
function onSelect(item) {
  item.action?.(item)
  dropdownClose()
}

function clickOutside(evt) {
  if (
    !evt.target.closest(`[data-component="${dropdownId}"]`) &&
    !evt.target.closest(`[data-popper="${dropdownId}"]`)
  ) {
    dropdownClose()
  }
}

watch(dropdownVisible, (val) => emits('changeVisible', val))

defineExpose({ dropdownClose })
</script>

<template>
  <div v-click-outside="clickOutside" :data-component="dropdownId">
    <div ref="dependentRef" class="h-full" @click="dropdownToogle">
      <slot name="button">
        <AppButton v-bind="props.buttonAttrs" class="relative"> <slot></slot> </AppButton>
      </slot>
    </div>

    <Teleport to="body">
      <PopperComponent
        :data-popper="dropdownId"
        :visible="dropdownVisible"
        :dependentRef="dependentRef"
        :offset="props.offset"
        :placement="props.placement"
        :sameWidth="props.sameWidth"
        :arrow="props.arrow"
        :disableDefaulShadow="props.disableDefaulShadow"
        :wrapClasses="[`bg-white rounded-md border border-gray-100 z-50`, props.dropdownClasses]"
      >
        <slot name="dropdown" :close="dropdownClose">
          <div class="p-2 pr-1">
            <ul class="max-h-[250px] overflow-auto scrollbar-primary pr-1">
              <li><slot name="dropdownPrepend" :close="dropdownClose" /></li>
              <component
                v-for="(item, idx) in items"
                :key="idx"
                :is="item.tag || 'li'"
                class="h-8 flex items-center gap-2 text-sm cursor-pointer rounded hover:bg-primary/10 px-2"
                :class="[
                  item.active &&
                    'bg-primary/20 hover:bg-primary/20 text-primary font-medium cursor-default'
                ]"
                v-bind="item.attrs"
                @click="onSelect(item)"
              >
                <InlineSvg
                  v-if="item.icon"
                  :src="item.icon"
                  class="text-primary"
                  :class="[item.iconClasses]"
                />
                {{ getItemName(item) }}
              </component>
              <li
                v-if="!items.length"
                class="h-8 flex items-center justify-center text-gray-400 text-sm leading-none"
              >
                {{ $t('noData') }}
              </li>
            </ul>
          </div>
        </slot>
      </PopperComponent>
    </Teleport>
  </div>
</template>
