<script setup>
import { computed } from 'vue'
import { useUsersService } from '@/core/service/users.service'

const usersService = useUsersService()

const user = computed(() => usersService.selectedUser)
const inboxList = computed(() => {
  const list = user.value?.mailcert_inboxlist?.inbox
  return !list ? [] : Array.isArray(list) ? list : [list]
})
</script>

<template>
  <div class="w-full h-fit border-2 rounded-lg shadow px-4 pt-2 pb-3">
    <div class="min-h-[34px] flex items-center justify-between gap-2">
      <h4 class="text-gray-600 font-medium leading-tight">
        {{ $t('userRegisteredEmail.contractAddress.title') }}
      </h4>
    </div>
    <div class="py-2">
      <div class="border-b border-gray-300"></div>
    </div>
    <ul class="flex flex-col gap-2">
      <li v-for="email in inboxList" :key="email" class="flex items-center gap-1.5">
        <div
          class="h-[24px] w-full max-w-[3px] bg-secondary/80 rounded-full text-xs leading-none text-transparent"
        ></div>

        <span class="font-medium text-gray-500 break-all max-2xl:text-sm max-2xl:leading-tight">
          {{ email }}
        </span>
      </li>
      <li
        v-if="!inboxList.length"
        class="border border-dashed font-medium text-sm text-gray-400 text-center rounded py-2 px-4"
      >
        {{ $t('userRegisteredEmail.contractAddress.emptyText') }}
      </li>
    </ul>
  </div>
</template>
