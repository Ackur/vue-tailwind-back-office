<script setup>
import AppButton from '@/components/ui/app-button/AppButton.vue'
import ResultInfoCard from '@/components/misc/ResultInfoCard.vue'
</script>

<template>
  <div class="h-full flex items-center justify-center p-6 max-lg:p-3">
    <ResultInfoCard
      :title="$t('passwordChangedPage.title')"
      :desc="$t('passwordChangedPage.description')"
      class="max-sm:h-fit"
    >
      <template #actions>
        <AppButton as="RouterLink" to="/login" color="success" light class="mt-8">
          {{ $t('passwordChangedPage.actionLink') }}
        </AppButton>
      </template>
    </ResultInfoCard>
  </div>
</template>
