<script setup>
import AppButton from '@/components/ui/app-button/AppButton.vue'
import ResultInfoCard from '@/components/misc/ResultInfoCard.vue'
</script>

<template>
  <div class="h-full flex items-center justify-center p-6 max-lg:p-3">
    <ResultInfoCard
      :title="$t('authWrongPage.title')"
      :desc="$t('authWrongPage.description')"
      type="danger"
      class="max-sm:h-fit"
    >
      <template #actions>
        <AppButton as="RouterLink" to="/login" color="danger" light class="mt-8">
          {{ $t('authWrongPage.actionLink') }}
        </AppButton>
      </template>
    </ResultInfoCard>
  </div>
</template>
