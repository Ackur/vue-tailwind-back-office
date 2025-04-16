import { nextTick } from 'vue'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify.js'
import { newUserTemplate, providers, topups, userStats } from './data/index.data'
import { asyncSleep } from '../../utils'
import { HttpError } from './helpers'
import { normalizeStatsData } from '@/core/utils/users-utils/stats.utils.js'

class KakeApiClient {
  toaster = null
  authToken = localStorage.getItem('userToken')
  errorHandler = null
  db = { providers }

  constructor() {
    this.errorHandler = (err) => {
      const msg = err.status || err.message || err
      msg && this.toaster.error(msg)
      if (err.code === 401) this.auth.logout()
      return err
    }

    nextTick(() => {
      this.toaster = useNotifications()
    })
  }

  request = async (func) => {
    try {
      await asyncSleep(1000)
      return func()
    } catch (error) {
      console.log(error)
      throw this.errorHandler(error)
    }
  }

  get auth() {
    return {
      login: ({ provider, password }) =>
        this.request(() => {
          const basicAuthToken = btoa(`${provider}:${password}`)
          if (!this.db.providers[basicAuthToken]) {
            throw HttpError.Unauthorized('Invalid credentials')
          }
          this.authToken = basicAuthToken
          return basicAuthToken
        }),
      getAuthHeader: () => this.getHeader('Authorization'),
      logout: () => {
        this.authToken = null
        localStorage.removeItem('userToken')
      },
      forgotPassword: ({ provider, password }) => this.request(() => {})
    }
  }

  get users() {
    return {
      createUser: (body) =>
        this.request(() => {
          const provider = this.db.providers[this.authToken]
          if (!provider) {
            throw HttpError.Unauthorized('Invalid credentials')
          }
          const newUser = {
            ...newUserTemplate,
            ...body,
            lastop: new Date().toISOString(),
            created: new Date().toISOString(),
            userpass: undefined,
            id: Date.now().toString()
          }
          if (newUser.email) {
            newUser.mailcert_inboxlist.inbox = [newUser.email]
            newUser.mailcert_settings.admin_mail = newUser.email
          }
          delete newUser.userpass
          provider.credit -= newUser.credit
          provider.users.push(newUser)
          return { user: newUser, provider }
        }),
      get: (params) =>
        this.request(() => {
          const provider = this.db.providers[this.authToken]
          if (!provider) {
            throw HttpError.Unauthorized('Invalid credentials')
          }
          return {
            users: window.structuredClone(provider.users),
            total: provider.users.length
          }
        }),
      updateUsers: ({ fields, field, value, usersIds }) =>
        this.request(() => {
          const provider = this.db.providers[this.authToken]
          if (!provider) {
            throw HttpError.Unauthorized('Invalid credentials')
          }
          if (!field && !fields) {
            throw HttpError.BadRequest()
          }
          const { users } = provider
          const updatedUsers = users.filter((user) => usersIds.includes(user.id))
          updatedUsers.forEach((user) => {
            if (field) user[field] = value
            if (fields) {
              Object.keys(fields).forEach((key) => {
                user[key] = fields[key]
              })
            }
          })

          return { provider, ...(updatedUsers.length === 1 && { user: updatedUsers.at(0) }) }
        }),
      getOne: (userId) =>
        this.request(() => {
          const provider = this.db.providers[this.authToken]
          if (!provider) {
            throw HttpError.Unauthorized('Invalid credentials')
          }
          const user = provider.users.find((user) => user.id === userId)
          if (!user) {
            throw HttpError.NotFound('User not found')
          }
          return { user }
        }),
      addAction: ({ userId, data }) =>
        this.request(() => {
          const provider = this.db.providers[this.authToken]
          if (!provider) {
            throw HttpError.Unauthorized('Invalid credentials')
          }
          const user = provider.users.find((user) => user.id === userId)
          if (!user) {
            throw HttpError.NotFound('User not found')
          }
          user.actions.push({ ...data, type: data.action, id: Date.now() })
          return { user }
        }),
      removeAction: ({ userId, actionId }) =>
        this.request(() => {
          const provider = this.db.providers[this.authToken]
          if (!provider) {
            throw HttpError.Unauthorized('Invalid credentials')
          }
          const user = provider.users.find((user) => user.id === userId)
          if (!user) {
            throw HttpError.NotFound('User not found')
          }
          const actionIndex = user.actions.findIndex((action) => action.id === actionId)
          if (actionIndex === -1) {
            throw HttpError.NotFound('Action not found')
          }
          user.actions.splice(actionIndex, 1)
          return { user }
        }),
      setEmailCertificateSettings: ({ userId, action, fields }) =>
        this.request(() => {
          const provider = this.db.providers[this.authToken]
          if (!provider) {
            throw HttpError.Unauthorized('Invalid credentials')
          }
          const user = provider.users.find((user) => user.id === userId)
          if (!user) {
            throw HttpError.NotFound('User not found')
          }
          if (!user[action]) {
            throw HttpError.BadRequest(`Invalid action name "${action}"`)
          }
          user[action] = { ...user[action], ...fields }

          return { user }
        }),
      addRegisteredWhitelistEmail: ({ userId, email }) =>
        this.request(() => {
          const provider = this.db.providers[this.authToken]
          if (!provider) {
            throw HttpError.Unauthorized('Invalid credentials')
          }
          const user = provider.users.find((user) => user.id === userId)
          if (!user) {
            throw HttpError.NotFound('User not found')
          }
          const emailIndex = user.mailcert_whitelist.wrow.findIndex(
            (item) => item.mail_from === email
          )
          if (emailIndex > -1) {
            throw HttpError.BadRequest('Email already exists')
          }
          user.mailcert_whitelist.wrow.push({ mail_from: email })
          return { user }
        }),
      removeRegisteredWhitelistEmail: ({ userId, email }) =>
        this.request(() => {
          const provider = this.db.providers[this.authToken]
          if (!provider) {
            throw HttpError.Unauthorized('Invalid credentials')
          }
          const user = provider.users.find((user) => user.id === userId)
          if (!user) {
            throw HttpError.NotFound('User not found')
          }
          const emailIndex = user.mailcert_whitelist.wrow.findIndex(
            (item) => item.mail_from === email
          )
          if (emailIndex === -1) {
            throw HttpError.NotFound('Email not found')
          }
          user.mailcert_whitelist.wrow.splice(emailIndex, 1)
          return { user }
        }),
      getUserStats: ({ group_by }) =>
        this.request(() => {
          const provider = this.db.providers[this.authToken]
          if (!provider) {
            throw HttpError.Unauthorized('Invalid credentials')
          }
          return normalizeStatsData(group_by, userStats)
        })
    }
  }

  get topUps() {
    return {
      getAll: (params) => this.request(() => ({ topups: topups, total: topups.length }))
    }
  }

  get provider() {
    return {
      getProviderInfo: () =>
        this.request(() => {
          const provider = this.db.providers[this.authToken]
          if (!provider) {
            throw HttpError.Unauthorized('Invalid credentials')
          }
          return { provider }
        }),
      setEmailBodySettings: ({ body, type }) =>
        this.request(() => {
          const provider = this.db.providers[this.authToken]
          if (!provider) {
            throw HttpError.Unauthorized('Invalid credentials')
          }
          if (!provider.delivery_receipt_conf[type]) {
            throw HttpError.BadRequest(`Invalid type "${type}"`)
          }
          provider.delivery_receipt_conf[type] = body
          return { provider }
        }),
      setEmailFromAddress: (email) =>
        this.request(() => {
          const provider = this.db.providers[this.authToken]
          if (!provider) {
            throw HttpError.Unauthorized('Invalid credentials')
          }
          provider.delivery_receipt_conf.from = email
          return { provider }
        })
    }
  }
}

export default new KakeApiClient()
