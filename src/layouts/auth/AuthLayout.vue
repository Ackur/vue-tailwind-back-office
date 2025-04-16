<script setup>
import AuthHeader from './components/AuthHeader.vue'
import AuthFooter from './components/AuthFooter.vue'
import AuthContent from './components/AuthContent.vue'
</script>

<template>
  <div class="h-screen flex flex-col bg-slate-100 text-gray-800 font-inter">
    <AuthHeader />

    <AuthContent />

    <AuthFooter />
  </div>
</template>
