<template>
  <div
    class="fixed left-0 top-0 bottom-0 w-0 bg-slate-950/50 overflow-hidden duration-500 delay-200 z-[49]"
    :class="[{ 'w-full': isResponsive && !collapsed }]"
    @click="collapseClick"
  />
  <div
    class="fixed left-0 h-fit bg-slate-900 drop-shadow-md ease-in-out duration-500 will-change-[left] z-50"
    :class="[{ 'left-[-270px]': isResponsive && collapsed }]"
  >
    <div
      ref="topRef"
      class="relative flex items-center h-[70px] border-b border-gray-700 border-dashed max-lg:h-[60px] px-4"
    >
      <RouterLink to="/" class="flex items-center gap-2 overflow-hidden">
        <InlineSvg
          src="/media/icons/pic1-icon.svg"
          class="w-10 h-10 ease-in-out duration-300 text-success"
          :class="[collapsed && !hovered && '!w-8 !h-8']"
        />

        <Transition
          enter-active-class="w-0 overflow-hidde transition duration-200"
          leave-active-class="transition duration-0"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0 overflow-hidden"
        >
          <span v-if="!collapsed || hovered" class="block text-white text-xl"> Tools </span>
        </Transition>
      </RouterLink>
      <button
        class="absolute -right-4 h-8 w-8 [&_svg]:w-5 grid place-items-center bg-gray-200 rounded-md drop-shadow-sm duration-500 delay-200 hover:drop-shadow-lg"
        :class="[
          {
            '!-right-5 !h-7 !w-7 [&_svg]:!w-4': !isResponsive && collapsed,
            '!-right-8 !w-9': isResponsive && collapsed
          }
        ]"
        @click="collapseClick"
      >
        <InlineSvg
          src="media/icons/double-arrow-icon.svg"
          class="rotate-90 ease-in-out duration-500 delay-200"
          :class="[
            {
              'rotate-[270deg]': collapsed
            }
          ]"
        />
      </button>
    </div>

    <div class="overflow-hidden py-5" :style="`height: ${mainMaxHeight}px`">
      <div
        class="w-[270px] h-full px-2 overflow-y-auto overflow-x-hidden scrollbar-primary ease-in-out duration-300 will-change-[width]"
        :class="[{ 'w-[65px] hover:w-[270px]': !isResponsive && collapsed }]"
        @mouseenter="!isResponsive && collapsed && (hovered = true)"
        @mouseleave="!isResponsive && collapsed && (hovered = false)"
      >
        <AsideMenuItem
          v-for="item in menuItems"
          :key="item.title"
          :item="item"
          :parentCollapsed="collapsed"
          :parentHovered="hovered"
        />
      </div>
    </div>

    <div
      v-if="isDevMode"
      ref="bottomRef"
      class="flex items-center justify-center border-t border-gray-700 border-dashed p-1"
    >
      <AppDropdown
        :items="devMenuItems"
        placement="right"
        :offset="[-75, 1]"
        :buttonAttrs="{
          icon: true,
          light: true,
          hoverTextColor: 'white',
          class: 'text-white rounded-lg'
        }"
      >
        <InlineSvg :src="asset('media/icons/code-icon.svg')" class="w-7 h-7" />
      </AppDropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { asset } from '@/core/utils/utils'

import InlineSvg from 'vue-inline-svg'
import AsideMenuItem from './components/AsideMenuItem.vue'
import AppDropdown from '@/components/ui/app-dropdown/AppDropdown.vue'

const { t } = useI18n()

const props = defineProps({
  responsiveBreakpoint: { type: [String, Number], default: 1024 }
})
const emits = defineEmits(['onCollapse'])

const collapsed = ref(false)
const hovered = ref(false)
const mediaQuery = ref()
const isResponsive = ref(false)
const topRef = ref()
const bottomRef = ref()
const mainMaxHeight = ref(0)

const isDevMode = computed(() => import.meta.env.DEV)

const devMenuItems = [
  {
    title: 'Dev Fonts',
    tag: 'RouterLink',
    icon: 'media/icons/code-icon.svg',
    iconClasses: 'w-4',
    attrs: { to: '/dev-fonts' }
  },
  {
    title: 'Dev Icons',
    tag: 'RouterLink',
    icon: 'media/icons/code-icon.svg',
    iconClasses: 'w-4',
    attrs: { to: '/dev-icons' }
  },
  {
    title: 'Dev Buttons',
    tag: 'RouterLink',
    icon: 'media/icons/code-icon.svg',
    iconClasses: 'w-4',
    attrs: { to: '/dev-buttons' }
  }
]
const menuItems = computed(() => [
  {
    title: t('appAside.menuItems.dashboard'),
    icon: './media/icons/compiling-icon.svg',
    tag: 'RouterLink',
    attrs: { to: '/' }
  },
  {
    title: t('appAside.menuItems.users'),
    icon: './media/icons/users-group-icon.svg',
    tag: 'div',
    childrens: [
      {
        title: t('appAside.menuItems.usersList'),
        tag: 'RouterLink',
        attrs: { to: '/users-list' }
      }
    ]
  },
  {
    title: t('appAside.menuItems.toolbox'),
    icon: './media/icons/box-icon.svg',
    tag: 'div',
    childrens: [
      {
        title: t('appAside.menuItems.topUps'),
        tag: 'RouterLink',
        attrs: { to: '/top-ups' }
      },
      {
        title: t('appAside.menuItems.myProfile'),
        tag: 'RouterLink',
        attrs: { to: '/my-profile' }
      },
      {
        title: t('appAside.menuItems.generalSettings'),
        tag: 'RouterLink',
        attrs: { to: '/general-settings' }
      }
    ]
  }
])

function setHeightToMainRef() {
  const refsHeights = {
    topRef: topRef.value?.offsetHeight || 0,
    bottomRef: bottomRef.value?.offsetHeight || 0
  }
  if (bottomRef.value) {
    bottomRef.value.style.height = refsHeights.bottomRef + 'px'
  }
  mainMaxHeight.value = window.innerHeight - refsHeights.topRef - refsHeights.bottomRef
}

function collapseClick() {
  collapsed.value = !collapsed.value
  callOnCollapseEmit()
}

function callOnCollapseEmit() {
  emits('onCollapse', isResponsive.value ? '' : collapsed.value ? 'pl-[65px]' : 'pl-[270px]')
}

function responsiveMediaHandler(event) {
  isResponsive.value = collapsed.value = event.matches
  callOnCollapseEmit()
}

onMounted(() => {
  mediaQuery.value = window.matchMedia(`(max-width: ${props.responsiveBreakpoint}px)`)
  mediaQuery.value.addEventListener('change', responsiveMediaHandler)
  responsiveMediaHandler({ matches: window.innerWidth <= props.responsiveBreakpoint })

  setHeightToMainRef()
  callOnCollapseEmit()
  window.addEventListener('resize', setHeightToMainRef)
})
onUnmounted(() => {
  window.removeEventListener('resize', setHeightToMainRef)
  mediaQuery.value.removeEventListener('change', responsiveMediaHandler)
})
</script>
