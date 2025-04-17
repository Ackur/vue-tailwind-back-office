<template>
  <div class="flex flex-wrap gap-4 max-w-5xl text-primary">
    <div v-for="icon in filteredIcons" :key="icon" class="relative group">
      <span>
        <InlineSvg
          :src="icon.path"
          width="42"
          height="42"
          class="hover:text-success-darken"
          :title="icon.name"
        />
      </span>
      <button
        class="absolute top-[-16px] right-[-10px] hidden group-hover:flex"
        @click="onClickCopy(icon.path)"
      >
        <InlineSvg src="/media/icons/dublicate-icon.svg" class="text-warning" />
      </button>
    </div>
  </div>
</template>

<script>
const modules = import.meta.glob('/public/media/icons/*.svg')
import { ref, computed } from 'vue'
import { copyToClipboard } from '@/core/utils/utils.js'
import InlineSvg from 'vue-inline-svg'

export default {
  name: 'ProjectIconsView',
  components: { InlineSvg },
  setup() {
    const search = ref('')
    const icons = Object.keys(modules).map((el) => {
      const pathArray = el.split('/')
      pathArray.splice(1, 1)
      return {
        name: pathArray.at(-1),
        path: pathArray.join('/')
      }
    })

    const filteredIcons = computed(() => {
      return icons.filter((item) =>
        JSON.stringify(item.name).toLowerCase().includes(search.value.toLowerCase())
      )
    })

    const onClickCopy = (value) => {
      console.log('onClickCopy')
      copyToClipboard(value)
    }

    return { search, icons, filteredIcons, onClickCopy }
  }
}
</script>
