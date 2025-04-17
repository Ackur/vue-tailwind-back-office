<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppDropdown from '@/components/ui/app-dropdown/AppDropdown.vue'
import UserMenuItem from './UserMenuItem.vue'

const { locale } = useI18n()

const langs = {
  ca: 'Català',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  pt: 'Portugûes'
}

const languagesList = computed(() => {
  return Object.entries(langs).map(([key, value]) => {
    return {
      title: value,
      value: key,
      //   icon: 'media/icons/commit-icon.svg',
      iconClasses: 'rotate-90',
      active: key === locale.value,
      action: onSelect
    }
  })
})

function onSelect({ value }) {
  if (value === locale.value) return
  locale.value = value
  sessionStorage.setItem('lang', value)
}

function initialize() {
  const shortLangsList = Object.keys(langs)
  if (!shortLangsList.includes(locale.value)) {
    onSelect(shortLangsList.at(0))
  }
}

onMounted(initialize)
</script>

<template>
  <AppDropdown
    :items="languagesList"
    arrow
    placement="left-start"
    :offset="[0, 10]"
    :dropdownClasses="`bg-white rounded-lg border`"
  >
    <template #button>
      <UserMenuItem
        v-bind="{
          title: $t('appHeader.userMenu.language'),
          icon: 'media/icons/earth-icon.svg',
          tag: 'button'
        }"
      >
        <template #append>
          <div class="text-xs text-primary bg-primary/10 rounded-md shadow-sm ml-auto px-2 py-1">
            {{ langs[locale] }}
          </div>
        </template>
      </UserMenuItem>
    </template>
  </AppDropdown>
</template>
