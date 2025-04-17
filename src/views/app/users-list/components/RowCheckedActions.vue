<script setup>
import { ref } from 'vue'
import { useUsersService } from '@/core/service/users.service'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify.js'
import { useI18n } from 'vue-i18n'
import { asset } from '@/core/utils/utils'

import vTooltip from '@/directives/tooltip.directive'
import InlineSvg from 'vue-inline-svg'
import AppButton from '@/components/ui/app-button/AppButton.vue'
import QuestionModal from '@/components/modals/QuestionModal.vue'

const props = defineProps({ checkedRows: Array })
const usersService = useUsersService()
const toaster = useNotifications()
const { t } = useI18n()

const showConfirmModal = ref(false)
const currentAction = ref({})

const actions = ref([
  {
    title: 'user',
    icon: 'media/icons/accept-user-icon.svg',
    color: 'secondary',
    tooltip: 'usersTable.checkedAction.userOn.tooltip',
    question: 'usersTable.checkedAction.userOn.question',
    loading: false,
    field: 'status',
    value: 'A'
  },
  {
    title: 'user',
    icon: 'media/icons/disable-user-icon.svg',
    color: 'secondary',
    tooltip: 'usersTable.checkedAction.userOff.tooltip',
    question: 'usersTable.checkedAction.userOff.question',
    loading: false,
    field: 'status',
    value: 'I'
  },
  {
    title: 'demo',
    icon: 'media/icons/demo-on-v2-icon.svg',
    color: 'secondary',
    tooltip: 'usersTable.checkedAction.demoOn.tooltip',
    question: 'usersTable.checkedAction.demoOn.question',
    loading: false,
    field: 'demo',
    value: '1'
  },
  {
    title: 'demo',
    icon: 'media/icons/demo-off-v2-icon.svg',
    color: 'secondary',
    tooltip: 'usersTable.checkedAction.demoOff.tooltip',
    question: 'usersTable.checkedAction.demoOff.question',
    loading: false,
    field: 'demo',
    value: '0'
  }
])

function onActionClick(action) {
  currentAction.value = action
  showConfirmModal.value = true
}

async function submitAction() {
  try {
    currentAction.value.loading = true
    const { field, value } = currentAction.value
    await usersService.updateUsers({
      field,
      value,
      usersIds: props.checkedRows.map((el) => el.id),
      returnUsers: true
    })
    toaster.s(t('usersTable.checkedAction.successMessage'))
  } catch (error) {
    console.log(error)
  } finally {
    currentAction.value.loading = false
  }
}
</script>

<template>
  <div
    class="flex items-center bg-[#e5f5fe] rounded-bl-lg rounded-br-lg transition-all duration-500"
    :class="[props.checkedRows.length ? 'h-10 px-3' : 'h-0 border-b-0 overflow-hidden']"
  >
    <div
      class="w-full flex items-center gap-2 invisible opacity-0 transition-all duration-200"
      :class="[props.checkedRows.length && '!visible !opacity-100 !duration-500 delay-300']"
    >
      <AppButton
        v-for="item in actions"
        :key="item.icon"
        v-tooltip:top="$t(item.tooltip)"
        size="sm"
        :color="item.color"
        icon
        light
        outline
        :loading="item.loading"
        class="shadow-none rounded-md"
        @click="onActionClick(item)"
      >
        <InlineSvg :src="asset(item.icon)" :class="[item.iconClasses]" />
      </AppButton>

      <div
        class="ml-auto px-2 py-1 border-secondary/80 rounded-lg text-secondary text-sm font-medium leading-none"
      >
        <span class="font-bold">{{ props.checkedRows.length }}</span> -
        {{ $t('usersTable.checkedAction.selected') }}
      </div>
    </div>
  </div>
  <Teleport to="body">
    <QuestionModal
      v-model:show="showConfirmModal"
      :text="currentAction.question"
      position="center"
      @onApply="submitAction"
    />
  </Teleport>
</template>
