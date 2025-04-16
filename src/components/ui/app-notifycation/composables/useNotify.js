import { reactive } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { makeid } from '@/core/utils/utils.js'

export const useNotifications = defineStore('useNotifications', () => {
  const timer = 5000
  const notifications = reactive([])
  const notifyTypes = {
    info: {
      bgClass: 'bg-info',
      textClass: 'text-white',
      iconClass: '',
      icon: './media/icons/info-icon.svg',
      timer
    },
    warning: {
      bgClass: 'bg-warning',
      textClass: 'text-white',
      iconClass: '',
      icon: './media/icons/info-icon.svg',
      timer
    },
    success: {
      bgClass: 'bg-success',
      textClass: 'text-white',
      iconClass: '',
      icon: './media/icons/check-v2-icon.svg',
      timer
    },
    error: {
      bgClass: 'bg-danger',
      textClass: 'text-white',
      iconClass: '',
      icon: './media/icons/info-icon.svg',
      timer
    }
  }

  const success = s
  const warning = w
  const error = e
  const info = i
  const add = (options) => addNotify(options)

  function s(text, title, options = {}) {
    addNotify({ ...notifyTypes['success'], text, title, ...options })
  }
  function w(text, title, options = {}) {
    addNotify({ ...notifyTypes['warning'], text, title, ...options })
  }
  function i(text, title, options = {}) {
    addNotify({ ...notifyTypes['info'], text, title, ...options })
  }
  function e(text, title, options = {}) {
    addNotify({ ...notifyTypes['error'], text, title, ...options })
  }

  function addNotify(options) {
    const id = makeid()
    notifications.unshift({ ...options, id })
    if (options.timer) {
      putToDeletionQueue(id)
    }
  }
  function putToDeletionQueue(id) {
    notifications.find((el) => el.id === id).timerFunc = setTimeout(() => {
      const index = notifications.findIndex((el) => el.id === id)
      const notifyItem = notifications[index]
      index >= 0 && !notifyItem.stoped && close(index)
    }, timer)
  }
  function close(index) {
    notifications.splice(index, 1)
  }
  function mouseenter(index) {
    const notifyItem = notifications[index]
    if (notifyItem?.timer) {
      notifyItem.stoped = true
      clearTimeout(notifyItem.timerFunc)
    }
  }
  function mouseleave(index) {
    const notifyItem = notifications[index]
    if (notifyItem?.timer && notifyItem.stoped) {
      notifyItem.stoped = false
      putToDeletionQueue(notifyItem.id)
    }
  }

  return {
    s,
    w,
    i,
    e,
    add,
    success,
    warning,
    error,
    info,
    notifications,
    close,
    mouseenter,
    mouseleave
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotifications, import.meta.hot))
}

// =========== HOW TO USE ===========
// import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'

// const toaster = useNotifications()

// toaster.s('description...')
// toaster.w('description...', 'Warning notify title')
// toaster.e('', 'Danger notify title')

// toaster.i('description...', 'Info notify title', { timer: 0 })

// toaster.add({
//   title: 'Custom notify',
//   text: 'description...',
//   wrapClass: '...',
//   bgClass: 'bg-primary',
//   textClass: 'text-white',
//   iconClass: 'text-white',
//   icon: './media/icons/settings-icon.svg'
// })
