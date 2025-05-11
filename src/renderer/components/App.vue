<template>
  <UApp>
    <MainLayout>
      <template #sidebar> <TheSidebar /></template>
      <template #page>
        <main>
          <RouterView />
        </main>
      </template>
    </MainLayout>
  </UApp>
</template>

<script setup lang="ts">
import MainLayout from "./MainLayout.vue";
import TheSidebar from "./sidebar/TheSidebar.vue";
</script>

<style scoped></style>
