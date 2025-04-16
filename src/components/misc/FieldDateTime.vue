<script setup>
import { dateFormat } from '@/core/utils/utils'
import { reactive, watch } from 'vue'

const props = defineProps({ data: [String, Number] })
const date = reactive({ value: '', format: 'DD/MM/YYYY' })
const time = reactive({ value: '', format: 'HH:mm:ss' })

function getDateTime() {
  ;[date, time].forEach((el) => {
    el.value = dateFormat(props.data, { format: el.format }) || ''
  })
}

watch(() => props.data, getDateTime, { immediate: true })
</script>

<template>
  <div class="font-medium">
    <div>{{ date.value }}</div>
    <div class="text-gray-400">{{ time.value }}</div>
  </div>
</template>
