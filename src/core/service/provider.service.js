import fakeApiClient from '@/core/utils/api-client/fake/index.js'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useProviderService = defineStore('providerService', () => {
  const fakeApi = fakeApiClient

  const provider = ref(null)
  const loading = ref(false)
  const emailBodyOptions = [
    {
      title: 'generalSettingsPage.emailBody.types.delivered',
      value: 'message_delivered',
      type: 'delivered'
    },
    { title: 'generalSettingsPage.emailBody.types.sent', value: 'message_sent', type: 'sent' },
    {
      title: 'generalSettingsPage.emailBody.types.pending',
      value: 'message_pending',
      type: 'pending'
    },
    { title: 'generalSettingsPage.emailBody.types.failed', value: 'message_failed', type: 'failed' }
  ]

  async function getProviderInfo(name) {
    try {
      const response = await fakeApi.provider.getProviderInfo({ provider: name })
      provider.value = response.provider
      return response
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  function updateProvider(newData) {
    provider.value = window.structuredClone(newData)
  }

  async function setProviderEmailBodySettings({ body, type }) {
    try {
      loading.value = true
      const response = await fakeApi.provider.setEmailBodySettings({ body, type })
      updateProvider(response.provider)
      return response
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      loading.value = false
    }
  }
  async function setEmailFromAddress(email) {
    try {
      loading.value = true
      const response = await fakeApi.provider.setEmailFromAddress(email)
      updateProvider(response.provider)
      return response
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    emailBodyOptions,
    provider,
    updateProvider,
    getProviderInfo,
    setProviderEmailBodySettings,
    setEmailFromAddress
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProviderService, import.meta.hot))
}
