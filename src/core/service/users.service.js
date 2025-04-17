import fakeApiClient from '@/core/utils/api-client/fake/index.js'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import { useProviderService } from '@/core/service/provider.service'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import { format } from 'date-fns'
import { useI18n } from 'vue-i18n'
import { asyncSleep, deepClone, sortArrayObjects } from '../utils/utils'

class userPaginationDto {
  constructor(data) {
    this.limit = data.limit
    this.offset = data.offset
    this.total = data.total
  }
}
class getUsersParamsDto {
  constructor({ offset, limit, search, sorting, headers }) {
    this.iColumns = headers.length
    this.sColumns = ''
    this.iDisplayStart = offset
    this.iDisplayLength = limit
    this.sSearch = search
    this.bRegex = false
    this.iSortCol_0 = sorting.col
    this.sSortDir_0 = sorting.dir //asc|desc
    this.iSortingCols = 1

    headers.forEach((el, idx) => {
      this[`mDataProp_${idx}`] = el.field
      this[`bSortable_${idx}`] = !!el.sorted
      this[`sSearch_${idx}`] = ''
      this[`bRegex_${idx}`] = false
      this[`bSearchable_${idx}`] = !!el.sorted
    })
  }
}

export const useUsersService = defineStore('usersService', () => {
  const { t } = useI18n()
  const fakeApi = fakeApiClient
  const providerService = useProviderService()
  const toaster = useNotifications()

  const loading = ref(false)
  const users = reactive({
    headers: [
      {
        header: 'table.headers.username',
        field: 'name',
        fieldClasses: 'break-all',
        headClasses: 'min-w-[160px]',
        sorted: true
      },
      { header: 'table.headers.credit', field: 'credit', sorted: true },
      { header: 'table.headers.created', field: 'created', sorted: true },
      {
        header: 'table.headers.lastop',
        field: 'lastop',
        headClasses: 'min-w-[125px]',
        sorted: true
      },
      { header: 'table.headers.company', field: 'company', sorted: true },
      {
        header: 'table.headers.email',
        field: 'email',
        fieldClasses: 'break-all',
        headClasses: 'min-w-[160px]',
        sorted: true
      },
      { header: 'table.headers.demo', field: 'demo', sorted: true },
      { header: 'table.headers.status', field: 'status', sorted: true },
      {
        header: 'table.headers.actions',
        field: 'actions',
        headClasses: '[&>div]:w-full [&>div]:justify-end'
      }
    ],
    data: [],
    filteredData: computed(() => {
      return users.data
        .filter((el) =>
          users.searchFields.some((key) =>
            el[key].toString().toLowerCase().includes(users.search.toLowerCase())
          )
        )
        .toSorted(
          sortArrayObjects({
            sortedBy: users.headers[users.sorting.col].field,
            sortedDir: users.sorting.dir
          })
        )
    }),
    paginateData: computed(() => {
      const from = users.pagination.offset
      const to = from + users.pagination.limit
      return users.filteredData.slice(from, to)
    }),
    search: '',
    searchFields: ['name', 'credit', 'company', 'email', 'phone'],
    sorting: { col: 2, dir: 'asc' },
    pagination: {
      offset: 0,
      limit: 10,
      total: 0,
      totalFiltered: computed(() =>
        users.filteredData.length === users.data.length
          ? users.pagination.total
          : users.filteredData.length
      ),
      pageSizes: [10, 20, 50, 100]
    },
    emptyText: 'table.empty.default'
  })
  const selectedUser = ref(null)

  async function getUsers({
    search = users.search,
    pagination = users.pagination,
    sorting = users.sorting
  } = {}) {
    loading.value = true
    try {
      const params = {
        ...new getUsersParamsDto({ ...pagination, search, sorting, headers: users.headers })
      }
      const response = await fakeApi.users.get(params)
      users.data = response.users

      Object.assign(users.pagination, { ...new userPaginationDto({ ...response, ...pagination }) })
      users.search = search
      users.sorting = sorting

      return response
    } catch (err) {
      console.log(err)
      users.emptyText = 'table.empty.default'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createUser(form) {
    try {
      const { provider } = await fakeApi.users.createUser(form)
      getUsers()
      providerService.updateProvider(provider)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async function updateUsers({
    fields,
    field,
    value,
    usersIds = [selectedUser.value.id],
    returnUsers = false
  } = {}) {
    try {
      const { user, provider } = await fakeApi.users.updateUsers({ fields, field, value, usersIds })
      providerService.updateProvider(provider)
      if (user) {
        setSelectedUser(user)
      }
      if (returnUsers) {
        await getUsers()
      }
      return { user, provider }
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  function setSelectedUser(user) {
    if (selectedUser.value) {
      selectedUser.value = deepClone({ ...selectedUser.value, ...user })
    } else {
      selectedUser.value = deepClone(user)
    }
  }

  async function getUserInfo(userId = selectedUser.value.id) {
    try {
      const { user } = await fakeApi.users.getOne(userId)
      setSelectedUser(user)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async function addUserCredit({ value, usersId }) {
    try {
      if (providerService.provider.credit < value) {
        toaster.w(t('usersService.catchAlerts.addUserCredit.1600'))
        return
      }
      const { provider } = await updateUsers({
        field: 'credit',
        value: value + selectedUser.value.credit,
        usersIds: [usersId]
      })
      provider.credit -= value
      providerService.updateProvider(provider)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async function subtractUserCredit({ value, usersId }) {
    try {
      if (selectedUser.value.credit < value) {
        toaster.w(t('usersService.catchAlerts.addUserCredit.1600'))
        return
      }
      const { provider } = await updateUsers({
        field: 'credit',
        value: selectedUser.value.credit - value,
        usersIds: [usersId]
      })
      provider.credit += value
      providerService.updateProvider(provider)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  function changeUserPassword() {
    return asyncSleep(1000)
  }

  async function addUserAction(form) {
    try {
      const data = deepClone(form)
      const { user } = await fakeApi.users.addAction({
        userId: selectedUser.value.id,
        data
      })
      setSelectedUser(user)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async function removeUserAction(actionId) {
    try {
      const { user } = await fakeApi.users.removeAction({
        userId: selectedUser.value.id,
        actionId
      })
      setSelectedUser(user)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async function setEmailCertificateSettings(fields, action) {
    try {
      const { user } = await fakeApi.users.setEmailCertificateSettings({
        userId: selectedUser.value.id,
        action,
        fields
      })

      setSelectedUser(user)
    } catch (err) {
      this.getUserInfo()
      console.log(err)
      throw err
    }
  }

  async function addRegisteredWhitelistEmail(email) {
    try {
      const { user } = await fakeApi.users.addRegisteredWhitelistEmail({
        userId: selectedUser.value.id,
        email
      })

      setSelectedUser(user)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async function removeRegisteredWhitelistEmail(email) {
    try {
      const { user } = await fakeApi.users.removeRegisteredWhitelistEmail({
        userId: selectedUser.value.id,
        email
      })

      setSelectedUser(user)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async function getUserStats({ group_by, product_id, dates }) {
    try {
      const stats = await fakeApi.users.getUserStats({
        provider: providerService.provider.name,
        user_id: [Number(selectedUser.value.id)],
        group_by: group_by,
        ...(product_id && { product_id: [String(product_id)] }),
        start_date: format(dates.at(0), 'yyyy-MM-dd'),
        end_date: format(dates.at(1), 'yyyy-MM-dd')
      })
      selectedUser.value.stats = stats
      return selectedUser.value.stats
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  return {
    loading,
    users,
    selectedUser,
    getUsers,
    createUser,
    updateUsers,
    setSelectedUser,
    getUserInfo,
    addUserCredit,
    subtractUserCredit,
    changeUserPassword,
    addUserAction,
    removeUserAction,
    setEmailCertificateSettings,
    removeRegisteredWhitelistEmail,
    addRegisteredWhitelistEmail,
    getUserStats
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersService, import.meta.hot))
}
