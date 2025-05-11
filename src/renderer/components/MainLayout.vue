<template>
  <div class="grid main-layout h-screen">
    <div class="p-1">
      <slot name="sidebar" />
    </div>
    <USeparator orientation="vertical" />
    <div class="p-1">
      <slot name="page" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.main-layout {
  grid-template-columns: 10rem 0.25rem auto;
}
</style>
