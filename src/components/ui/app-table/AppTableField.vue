<script setup>
const props = defineProps({
  field: String,
  header: String,
  sorted: Boolean,
  headClasses: String,
  fieldClasses: String,
  item: Object
})
</script>

<template>
  <slot :item="props.item">{{ props.item[props.field] }}</slot>
</template>
