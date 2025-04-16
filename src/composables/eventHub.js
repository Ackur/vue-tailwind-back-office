import mitt from 'mitt'

export function useEventHub() {
  const emitter = mitt()

  const emitterEvents = {
    APP_VIEW_LOADER_VISIBILITY: 'app-view-loader-visibility',
    ADD_USER_MODAL_VISIBILITY: 'add-user-modal-visibility',
  }

  return { emitter, emitterEvents }
}
