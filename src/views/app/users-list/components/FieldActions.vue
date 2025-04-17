<script setup>
import { useUsersService } from '@/core/service/users.service'
import { asset } from '@/core/utils/utils'

import vTooltip from '@/directives/tooltip.directive'
import InlineSvg from 'vue-inline-svg'
import AppButton from '@/components/ui/app-button/AppButton.vue'

const usersService = useUsersService()
const props = defineProps({ item: Object })

function onSelectUser(user) {
  usersService.setSelectedUser(user)
}
</script>

<template>
  <div class="flex items-center justify-end gap-3">
    <div class="flex items-center">
      <AppButton
        v-tooltip:top="$t('tooltips.userInfo')"
        as="RouterLink"
        :to="{ name: 'User info', params: { userId: props.item.id } }"
        size="sm"
        color="none"
        icon
        class="text-secondary/80 shadow-none hover:text-secondary hover:bg-gray-100"
        @click="onSelectUser(props.item)"
      >
        <InlineSvg :src="asset('media/icons/arrow-right-icon.svg')" />
      </AppButton>
    </div>
  </div>
</template>
