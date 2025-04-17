<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { asset } from '@/core/utils/utils'

import InlineSvg from 'vue-inline-svg'
import AppDropdown from '@/components/ui/app-dropdown/AppDropdown.vue'

const { t } = useI18n()

const items = computed(() => [
  {
    title: t('cloudWidget.CS.title'),
    desc: t('cloudWidget.CS.description'),
    icon: 'media/logo/logo_CS.svg',
    attrs: { href: 'https://admintest.clickandsign.eu/login/', target: '_blank' }
  },
  {
    title: t('cloudWidget.openum.title'),
    desc: t('cloudWidget.openum.description'),
    icon: 'media/logo/logo_openum.svg',
    attrs: { href: 'https://admintest.openum.eu/login/', target: '_blank' }
  },
  {
    title: t('cloudWidget.contacts.title'),
    desc: t('cloudWidget.contacts.description'),
    icon: 'media/logo/logo_contacts.svg',
    attrs: { href: 'https://contacts.lleidanet.cloud', target: '_blank' }
  }
])
</script>

<template>
  <AppDropdown
    :offset="[-70, 8]"
    :buttonAttrs="{
      color: 'none',
      icon: true,
      class: 'shadow-none hover:bg-gray-100 max-lg:min-h-[30px] max-lg:min-w-[30px]'
    }"
    dropdownClasses="max-w-[325px] w-full border-none"
  >
    <template #default>
      <InlineSvg
        :src="asset('media/icons/lleida-cloud-icon.svg')"
        class="w-6 h-6 max-lg:w-5 max-lg:h-5"
      />
    </template>

    <template #dropdown="{ close }">
      <div class="">
        <header
          class="h-24 flex items-center justify-center bg-[url('media/cloud-bg-blue.jpg')] bg-cover bg-no-repeat rounded-t-md p-2"
        >
          <InlineSvg :src="asset('media/logo/lleidanet_cloud.svg')" class="w-64 h-auto" />
        </header>
        <main>
          <div>
            <a
              v-for="item in items"
              :key="item.title"
              v-bind="item.attrs"
              class="flex items-center gap-3 px-6 py-3 hover:bg-gray-50"
              @click="close"
            >
              <div class="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
                <img :src="item.icon" class="w-7 h-auto" />
              </div>
              <div class="flex flex-col text-sm leading-tight">
                <span class="text-gray-800 font-semibold">{{ item.title }}</span>
                <span class="text-gray-500">{{ item.desc }}</span>
              </div>
            </a>
          </div>
        </main>
      </div>
    </template>
  </AppDropdown>
</template>
