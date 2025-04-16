<template>
  <header
    class="h-[70px] bg-white flex items-center justify-between gap-2 drop-shadow-md pl-10 pr-6 z-[12] max-lg:h-[60px] max-sm:pr-3"
  >
    <HeaderTitle class="max-md:hidden" />
    <RouterLink to="/">
      <InlineSvg
        src="./media/icons/pic1-icon.svg"
        class="min-w-[38px] h-auto text-success hidden max-md:block"
      />
    </RouterLink>

    <div class="flex items-center gap-3 max-md:ml-auto">
      <div class="w-fit flex items-center gap-2 border border-dashed rounded-lg leading-none p-2">
        <!-- <span class="text-primary text-sm font-medium">Credits: </span> -->
        <span class="text-gray-600 text-sm font-semibold">
          {{ Number(providerService.provider?.credit || 0).toFixed(2) }}
        </span>
        <InlineSvg
          v-tooltip:top="$t('tooltips.credits')"
          src="./media/icons/wallet-icon.svg"
          class="w-6 h-auto text-primary drop-shadow-xl shadow-primary max-lg:w-5 max-lg:h-5"
        />
      </div>
      <!-- <CloudWidget /> -->

      <UserMenu />
    </div>
  </header>
</template>

<script setup>
import { useProviderService } from '@/core/service/provider.service'

import vTooltip from '@/directives/tooltip.directive'
import InlineSvg from 'vue-inline-svg'
import HeaderTitle from './components/HeaderTitle.vue'
import UserMenu from './components/user-menu/UserMenu.vue'
import CloudWidget from './components/CloudWidget.vue'

const providerService = useProviderService()
</script>
