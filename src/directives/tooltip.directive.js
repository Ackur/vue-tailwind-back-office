import { createPopper } from '@popperjs/core'
import {
  popperPlacements,
  tooltipClasses,
  tooltipShodowClasses,
  tooltipArrowClasses
} from '@/components/misc/popper-component/popper.config.js'

let popperInstances = {}
const tooltipIndexPrefix = 'tooltip-'

function getPopperOptions(placement, arrow) {
  return {
    placement: popperPlacements.includes(placement) ? placement : 'auto',
    strategy: 'fixed',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 5]
        }
      },
      {
        name: 'arrow',
        options: {
          element: arrow
        }
      },
      {
        name: 'computeStyles',
        options: {
          gpuAcceleration: false
        }
      }
    ]
  }
}

function eventCallback({ tooltipEl, instance }, action) {
  const actions = { show: 'remove', hide: 'add', toggle: 'toggle' }
  setTimeout(() => {
    tooltipEl.classList[actions[action]]('hidden')
    instance.update()
  }, 200)
}

function updateTooltipValues(tooltip, binding) {
  const textEl = tooltip.tooltipEl.querySelector('span')
  textEl.textContent = binding.value.text ? binding.value.text : binding.value
  if (typeof binding.value.textClasses === 'string') {
    textEl.className += ` ${binding.value.textClasses}`
  }
  if (typeof binding.value.tooltipClasses === 'string') {
    tooltip.tooltipEl.className += ` ${binding.value.tooltipClasses}`
  }
}

function createTooltip(el, binding) {
  const currentTooltipData = { tooltipEl: null, instance: null }
  const tooltipIndex =
    tooltipIndexPrefix +
    (Object.keys(popperInstances).length
      ? Number(Object.keys(popperInstances).at(-1).split('-').at(1)) + 1
      : 1)
  popperInstances[tooltipIndex] = currentTooltipData

  el.dataset.tooltipIndex = tooltipIndex // data-tooltip-index="{tooltip-num}"

  currentTooltipData.tooltipEl = document.createElement('div') // tooltip
  currentTooltipData.tooltipEl.className = [...tooltipClasses, ...tooltipShodowClasses].join(' ')
  !binding.modifiers.show && 'blablabla...'

  const content = document.createElement('span') // tooltip text
  currentTooltipData.tooltipEl.appendChild(content)

  const arrow = document.createElement('div') // tooltip arrow
  arrow.className = tooltipArrowClasses.join(' ')
  currentTooltipData.tooltipEl.appendChild(arrow)

  document.body.appendChild(currentTooltipData.tooltipEl)

  currentTooltipData.instance = createPopper(
    el,
    currentTooltipData.tooltipEl,
    getPopperOptions(binding.arg, arrow)
  )

  updateTooltipValues(currentTooltipData, binding)
}

function createTooltipToogle(el, binding) {
  const index = el.dataset.tooltipIndex
  if (index) {
    removeTooltip(el, binding)
  } else {
    createTooltip(el, binding)
  }
}

function removeTooltip(el, binding) {
  const index = el.dataset.tooltipIndex
  el.removeEventListener('mouseenter', createTooltip.bind(false, el, binding))
  el.removeEventListener('mouseleave', removeTooltip.bind(false, el, binding))
  el.removeEventListener('focusout', removeTooltip.bind(false, el, binding))
  el.removeEventListener('blur', removeTooltip.bind(false, el, binding))
  el.removeEventListener('click', createTooltipToogle.bind(false, el, binding))
  if (index && popperInstances[index]) {
    popperInstances[index].instance.destroy()
    popperInstances[index].tooltipEl.remove()
    delete popperInstances[index]
    el.dataset.tooltipIndex = ''
  }
}

export default {
  beforeMount(el, binding) {
    if (binding.modifiers.click) {
      el.addEventListener('click', createTooltipToogle.bind(false, el, binding))
    } else {
      el.addEventListener('mouseenter', createTooltip.bind(false, el, binding))
      el.addEventListener('mouseleave', removeTooltip.bind(false, el, binding))
      el.addEventListener('focusout', removeTooltip.bind(false, el, binding))
    }
  },
  async beforeUpdate(el, binding) {
    const index = el.dataset.tooltipIndex
    if (index && popperInstances[index]) {
      updateTooltipValues(popperInstances[index], binding)
      popperInstances[index].instance.update()
    }
  },
  unmounted(el, binding) {
    removeTooltip(el, binding)
  }
}

// =========== HOW TO USE ===========

// v-tooltip:top="tooltip text"

//OR

// v-tooltip:bottom.show.click="{
//   text: errorMsg,
//   textClasses: 'text-danger',
//   tooltipClasses: 'shadow-danger'
// }"
