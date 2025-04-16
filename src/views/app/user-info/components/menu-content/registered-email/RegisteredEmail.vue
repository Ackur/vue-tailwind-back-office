<script setup>
import ContractListEmails from './ContractListEmails.vue'
import FormComponent from './FormComponent.vue'
import WhiteListEmails from './WhiteListEmails.vue'
</script>

<template>
  <div>
    <div class="flex gap-6 max-lg:flex-col max-lg:items-center">
      <ContractListEmails class="max-lg:w-fit" />
      <WhiteListEmails class="max-lg:w-fit" />
    </div>
    <div class="pb-6 pt-8">
      <div class="border-b border-dashed"></div>
    </div>
    <h4 class="text-lg font-semibold mb-4">{{ $t('userRegisteredEmail.defaultSettings') }}</h4>
    <FormComponent />
  </div>
</template>
