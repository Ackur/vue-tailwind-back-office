import fakeApiClient from '@/core/utils/api-client/fake/index.js'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { useProviderService } from '@/core/service/provider.service'

export const useAuthService = defineStore('authService', () => {
  const fakeApi = fakeApiClient
  const providerService = useProviderService()

  const username = ref(localStorage.getItem('username'))
  const userToken = ref(localStorage.getItem('userToken'))
  const isAuth = ref(false)
  const loading = ref(false)

  async function login({ provider, password }) {
    try {
      loading.value = true
      const token = await fakeApi.auth.login({ provider, password })
      localStorage.setItem('userToken', token)
      localStorage.setItem('username', provider)
      username.value = provider
      userToken.value = token
      await checkAuth()
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function localCheckAuthToken() {
    const tokens = [userToken.value, localStorage.getItem('userToken'), fakeApi.authToken]
    const result = tokens.every(Boolean) && new Set(tokens).size === 1 //local token immutability check

    !result && logout()
    return result
  }

  async function checkAuth() {
    try {
      loading.value = true
      await providerService.getProviderInfo(username.value)
      isAuth.value = true
      return true
    } catch (err) {
      console.log(err)
      logout()
      throw err
    } finally {
      loading.value = false
    }
  }

  async function forgotPassword({ provider, password }) {
    try {
      loading.value = true
      await fakeApi.auth.forgotPassword({ provider, password })
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    try {
      fakeApi.auth.logout()
      localStorage.removeItem('userToken')
      localStorage.removeItem('username')
      username.value = null
      userToken.value = null
      isAuth.value = false
    } catch (error) {
      console.log(error)
    }
  }

  return {
    loading,
    username,
    userToken,
    isAuth,
    login,
    checkAuth,
    localCheckAuthToken,
    logout,
    forgotPassword
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthService, import.meta.hot))
}
