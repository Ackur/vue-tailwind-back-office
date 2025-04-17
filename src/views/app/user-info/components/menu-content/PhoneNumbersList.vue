<script setup>
import InlineSvg from 'vue-inline-svg'

const props = defineProps({ userData: Object })
</script>

<template>
  <div>
    <h4 class="text-lg font-semibold mb-4">{{ $t('userPhoneNumbers.title') }}</h4>

    <ul class="flex flex-col gap-2">
      <li
        v-for="num in props.userData.numbers"
        :key="num"
        class="w-fit flex items-center gap-2 bg-slate-100 rounded-md p-2"
      >
        <InlineSvg src="/media/icons/phone-icon.svg" class="w-5 text-success h-auto" />
        <a :href="`tel:${num}`" class="font-medium text-secondary">{{ num }}</a>
      </li>
      <li
        v-if="!props.userData.numbers.length"
        class="border border-dashed font-medium text-sm text-gray-400 text-center rounded py-2 px-4"
      >
        {{ $t('userPhoneNumbers.emptyText') }}
      </li>
    </ul>
  </div>
</template>
