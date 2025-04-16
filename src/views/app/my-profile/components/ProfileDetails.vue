<script setup>
import { computed } from 'vue'
import { useProviderService } from '@/core/service/provider.service'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const providerService = useProviderService()

const details = computed(() =>
  [
    { name: 'company', value: 'company' },
    { name: 'contactName', value: 'contact_name' },
    { name: 'cif', value: 'cif' },
    { name: 'phone', value: 'phone' },
    { name: 'email', value: 'email' },
    { name: 'country', value: 'country' },
    // { name: 'state', value: 'state' },
    { name: 'city', value: 'city' },
    { name: 'address', value: 'address' },
    { name: 'zip', value: 'zip' }
  ].map((el) => ({
    name: t(`myProfilePage.details.${el.name}`),
    value: providerService.provider[el.value] || '---'
  }))
)
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <header class="py-4 px-8 border-b max-sm:px-6">
      <h3 class="text-lg font-semibold">{{ $t('myProfilePage.details.title') }}</h3>
    </header>

    <main class="py-4 px-8 max-sm:px-6">
      <ul class="">
        <li
          v-for="item in details"
          :key="item.name"
          class="flex items-center [&:not(:last-of-type)]:border-b border-dashed py-1.5"
        >
          <span class="max-w-[300px] w-full text-sm font-medium text-gray-500">
            {{ item.name }}
          </span>
          <span class="w-full font-medium break-all leading-none text-secondary/70">
            {{ item.value }}
          </span>
        </li>
      </ul>
    </main>
  </div>
</template>
