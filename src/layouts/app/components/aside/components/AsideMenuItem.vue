<template>
  <div>
    <component
      :is="props.item.tag"
      v-bind="props.item.attrs"
      class="flex items-center gap-2 cursor-pointer px-3 py-2 group select-none"
      :class="[{ 'bg-gray-700 rounded-[4px]': parentIsActive && !props.item.childrens }]"
      @click="onClickParent"
    >
      <InlineSvg
        :src="props.item.icon"
        class="min-w-[24px] max-w-[24px] text-slate-400 group-hover:text-slate-50"
        :class="[
          {
            '!text-primary': linkSameAsRouterLink(props.item) || hasActiveChildren,
            'text-slate-50':
              showChildrens && !(linkSameAsRouterLink(props.item) || hasActiveChildren)
          }
        ]"
      />
      <span
        class="w-full text-gray-400 text-[13px] font-normal whitespace-nowrap overflow-hidden group-hover:text-slate-50"
        :class="[{ '!text-gray-200': parentIsActive }]"
      >
        {{ props.item.title }}
      </span>
      <div
        v-if="props.item.childrens"
        class="w-fit opacity-0 transition-opacity"
        :class="[(!props.parentCollapsed || props.parentHovered) && 'opacity-100']"
      >
        <InlineSvg
          src="/media/icons/arrow-right-v2-icon.svg"
          width="15"
          class="text-gray-400 rotate-90 transition-all"
          :class="[showChildrens && 'rotate-[270deg]']"
        />
      </div>
    </component>
    <Transition name="expand" @enter="enter" @after-enter="afterEnter" @leave="leave">
      <nav
        v-if="props.item.childrens && showChildrens"
        class="transition-all ease-in-out duration-300 overflow-hidden will-change-[height]"
      >
        <ul class="pl-5">
          <li v-for="child in props.item.childrens" :key="child.title">
            <component
              :is="child.tag"
              v-bind="child.attrs"
              class="flex items-center gap-2 cursor-pointer p-2 group select-none"
              :class="[{ 'bg-gray-800 rounded-[4px]': linkSameAsRouterLink(child) }]"
            >
              <span
                class="min-w-[4px] min-h-[4px] block rounded-full bg-slate-400 group-hover:bg-slate-50"
                :class="[{ '!bg-primary': linkSameAsRouterLink(child) }]"
              />
              <span
                class="text-gray-400 text-[13px] font-normal whitespace-nowrap overflow-hidden group-hover:text-slate-50"
                :class="[{ '!text-gray-200': linkSameAsRouterLink(child) }]"
              >
                {{ child.title }}
              </span>
            </component>
          </li>
        </ul>
      </nav>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import InlineSvg from 'vue-inline-svg'

const props = defineProps({
  item: Object,
  parentCollapsed: [Boolean, String],
  parentHovered: Boolean
})
const route = useRoute()
const showChildrens = ref(false)

const parentIsActive = computed(() => {
  return linkSameAsRouterLink(props.item) || hasActiveChildren.value || showChildrens.value
})
const hasActiveChildren = computed(() => props.item.childrens?.some(linkSameAsRouterLink))

function linkSameAsRouterLink(item) {
  return item.tag === 'RouterLink' && route.path === item.attrs.to
}
function onClickParent() {
  if (props.item.childrens) {
    showChildrens.value = !showChildrens.value
  }
}

function enter(element) {
  const height = getComputedStyle(element).height
  element.style.height = 0
  getComputedStyle(element).height
  element.style.height = height
}
function afterEnter(element) {
  element.style.height = 'auto'
}
function leave(element) {
  const height = getComputedStyle(element).height
  element.style.height = height
  getComputedStyle(element).height
  element.style.height = 0
}

watch(
  hasActiveChildren,
  (val) => {
    showChildrens.value = val ? !props.parentCollapsed || props.parentHovered : false
  },
  { immediate: true }
)

watch(
  () => props.parentCollapsed,
  (val) => {
    if (props.item.childrens) {
      showChildrens.value = val ? false : hasActiveChildren.value
    }
  }
)

watch(
  () => props.parentHovered,
  (val) => {
    if (props.item.childrens) {
      showChildrens.value = val ? hasActiveChildren.value : false
    }
  }
)
</script>
