<script setup>
import { computed } from 'vue'
import { useProviderService } from '@/core/service/provider.service'

import EmailBodyForms from './components/EmailBodyForms.vue'
import ChangeEmailButton from './components/ChangeEmailButton.vue'

const providerService = useProviderService()

const profile = computed(() => providerService.provider || {})
</script>

<template>
  <div class="w-full max-w-[1300px] mx-auto">
    <div class="bg-white rounded-lg shadow">
      <header class="py-6 px-8 border-b max-sm:px-5">
        <h4 class="text-xl font-medium leading-none">{{ $t('generalSettingsPage.title') }}</h4>
      </header>

      <main class="px-8 py-6 max-sm:px-5">
        <div class="flex flex-col gap-6">
          <div>
            <!-- <p class="w-fit font-bold border-b-2 mb-3">Delivery receipt</p> -->
            <div class="flex items-center gap-3 max-sm:flex-col max-sm:items-start max-sm:gap-0">
              <span class="w-fit text-gray-500 font-semibold border-b-2">
                {{ $t('generalSettingsPage.fromEmail.title') }}
              </span>
              <div class="flex items-center gap-1">
                <span class="text-secondary/70 font-semibold leading-none break-all">
                  {{ profile?.delivery_receipt_conf?.from }}
                </span>
                <ChangeEmailButton />
              </div>
            </div>
          </div>

          <div
            class="flex items-end justify-between max-sm:flex-col max-sm:gap-3 max-sm:items-start"
          >
            <p class="w-fit text-gray-500 font-semibold border-b-2">
              {{ $t('generalSettingsPage.emailBody.title') }}
            </p>
            <div class="w-fit border-2 border-dashed rounded-md shadow-sm py-2 px-3 max-sm:m-auto">
              <table>
                <caption class="text-sm font-medium text-gray-400 leading-none">
                  {{
                    $t('generalSettingsPage.emailBody.variables.title')
                  }}
                </caption>
                <tbody>
                  <tr>
                    <td class="font-semibold text-secondary/70">%%DST%%</td>
                    <td class="text-sm font-semibold px-1">-</td>
                    <td class="text-sm font-semibold">
                      {{ $t('generalSettingsPage.emailBody.variables.DST') }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-semibold text-secondary/70">%%DSENT%%</td>
                    <td class="text-sm font-semibold px-1">-</td>
                    <td class="text-sm font-semibold whitespace-nowrap">
                      {{ $t('generalSettingsPage.emailBody.variables.DSENT') }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-semibold text-secondary/70">%%DRECV%%</td>
                    <td class="text-sm font-semibold px-1">-</td>
                    <td class="text-sm font-semibold">
                      {{ $t('generalSettingsPage.emailBody.variables.DRECV') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <EmailBodyForms />
      </main>
    </div>
  </div>
</template>
