import fakeApiClient from '@/core/utils/api-client/fake/index.js'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import { useAuthService } from './auth.service'
import { useProviderService } from '@/core/service/provider.service'

class PaginationDto {
  constructor(data) {
    this.limit = data.limit
    this.offset = data.offset
    this.total = data.total
  }
}
class GetTopUpsParamsDto {
  constructor({ offset, limit, search, role, sorting, headers }) {
    this.request = role
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

export const useTopUpsService = defineStore('topUpsService', () => {
  const fakeApi = fakeApiClient
  const authService = useAuthService()
  const providerService = useProviderService()

  const loading = ref(false)
  const topUps = reactive({
    headers: [
      { header: 'topUps.table.headers.date', field: 'timestamp', sorted: true },
      { header: 'topUps.table.headers.name', field: 'name', sorted: true },
      { header: 'topUps.table.headers.credit', field: 'credit', sorted: true },
      { header: 'topUps.table.headers.type', field: 'type' }
    ],
    data: [],
    filteredData: computed(() => {
      return topUps.data
        .filter((item) => item.role === topUps.filters.role)
        .filter((el) =>
          topUps.searchFields.some((key) =>
            el[key].toString().toLowerCase().includes(topUps.filters.search.toLowerCase())
          )
        )
    }),
    paginateData: computed(() => {
      const from = topUps.pagination.offset
      const to = from + topUps.pagination.limit
      return topUps.filteredData.slice(from, to)
    }),
    filters: { search: '', role: '' },
    searchFields: ['name', 'credit', 'type', 'date', 'role'],
    sorting: { col: 0, dir: 'desc' },
    pagination: {
      offset: 0,
      limit: 10,
      total: 0,
      totalFiltered: computed(() =>
        topUps.filteredData.length === topUps.data.length
          ? topUps.pagination.total
          : topUps.filteredData.length
      ),
      pageSizes: [10, 20, 50, 100]
    },
    emptyText: 'table.empty.default',
    types: {
      Z: 'topUps.types.Z',
      T: 'topUps.types.T',
      A: 'topUps.types.A'
    },
    roles: [
      {
        name: 'topUps.roles.users',
        value: 'user'
      },
      {
        name: 'topUps.roles.admin',
        value: 'admin'
      }
    ]
  })

  async function getTopUps({
    search = topUps.filters.search,
    role = topUps.filters.role,
    pagination = topUps.pagination,
    sorting = topUps.sorting
  } = {}) {
    loading.value = true
    try {
      const params = {
        ...new GetTopUpsParamsDto({ ...pagination, search, role, sorting, headers: topUps.headers })
      }
      const response = await fakeApi.topUps.getAll(params)
      topUps.data = response.topups

      Object.assign(topUps.pagination, { ...new PaginationDto({ ...response, ...pagination }) })
      topUps.filters = { search, role }
      topUps.sorting = sorting

      return response
    } catch (err) {
      console.log(err)
      topUps.emptyText = 'table.empty.default'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getListAsXLS() {
    try {
      const url =
        import.meta.env.VITE_API_URL +
        'admin/report/v1/' +
        `?${new URLSearchParams({
          provider: providerService.provider.name,
          token: authService.userToken.split(' ').at(1),
          request: topUps.roles.find((el) => el.value === topUps.filters.role)?.exportRequest,
          plain: 1
        })}`
      return url
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  return {
    loading,
    topUps,
    getTopUps,
    getListAsXLS
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTopUpsService, import.meta.hot))
}
