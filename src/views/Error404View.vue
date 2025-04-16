<script setup>
import AppButton from '@/components/ui/app-button/AppButton.vue'
import ResultInfoCard from '@/components/misc/ResultInfoCard.vue'
</script>

<template>
  <div class="h-full flex items-center justify-center p-6 max-lg:p-3">
    <ResultInfoCard
      :title="$t('error404Page.title')"
      :desc="$t('error404Page.description')"
      type="danger"
      class="max-sm:h-fit"
    >
      <template #actions>
        <AppButton as="RouterLink" to="/" color="danger" light class="mt-8">
          {{ $t('error404Page.actionLink') }}
        </AppButton>
      </template>
    </ResultInfoCard>
  </div>
</template>
