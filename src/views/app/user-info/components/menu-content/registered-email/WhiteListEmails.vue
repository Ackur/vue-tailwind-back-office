<script setup>
import { computed } from 'vue'
import { useUsersService } from '@/core/service/users.service'

import InlineSvg from 'vue-inline-svg'
import AddEmailButton from './AddEmailButton.vue'
import RemoveEmailButton from './RemoveEmailButton.vue'
const usersService = useUsersService()

const user = computed(() => usersService.selectedUser)
const whiteList = computed(() => {
  const list = user.value?.mailcert_whitelist?.wrow
  return !list ? [] : Array.isArray(list) ? list : [list]
})
</script>

<template>
  <div class="w-full border-2 rounded-lg shadow px-4 pt-2 pb-3">
    <div class="flex items-center justify-between gap-2">
      <h4 class="text-gray-600 font-medium leading-tight">
        {{ $t('userRegisteredEmail.whiteList.title') }}
      </h4>

      <AddEmailButton :emails="whiteList" />
    </div>
    <div class="py-2">
      <div class="border-b border-gray-300"></div>
    </div>
    <ul class="flex flex-col gap-2">
      <li v-for="item in whiteList" :key="item.mail_from" class="flex items-center gap-1.5">
        <!-- <div class="h-[24px] w-full max-w-[3px] bg-secondary/80 rounded-full text-xs leading-none text-transparent"></div> -->
        <InlineSvg
          src="/media/icons/email-icon.svg"
          class="w-full max-w-[20px] h-auto text-secondary/70 max-2xl:max-w-[16px] max-sm:hidden"
        />
        <span class="font-medium text-gray-500 break-all max-2xl:text-sm max-2xl:leading-tight">
          {{ item.mail_from }}
        </span>
        <RemoveEmailButton :mail_from="item.mail_from" class="ml-auto" />
      </li>
      <li
        v-if="!whiteList.length"
        class="border border-dashed font-medium text-sm text-gray-400 text-center rounded py-2 px-4"
      >
        {{ $t('userRegisteredEmail.whiteList.emptyText') }}
      </li>
    </ul>
  </div>
</template>
