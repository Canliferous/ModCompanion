<template>
  <aside class="bg-default h-full flex flex-col">
    <div class="grow grid gap-1 content-start">
      <UButton
        v-for="btn of pageButtons"
        variant="soft"
        color="neutral"
        active-color="primary"
        :to="btn.route"
        :leading-icon="btn.icon"
      >
        {{ btn.name }}
      </UButton>
    </div>

    <div class="grid gap-1 content-start">
      <UButton size="small" variant="soft" color="neutral">Game</UButton>
      <UButton size="small" variant="soft" color="neutral">Game (Dev)</UButton>
      <UButton size="small" variant="soft" color="neutral"
        >Game (Tools)</UButton
      >
      <UButton size="small" variant="soft" color="neutral">Hammer</UButton>
      <UButton size="small" variant="soft" color="neutral">Faceposer</UButton>
      <UButton size="small" variant="soft" color="neutral">HLMV</UButton>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface PageButton {
  name: string;
  icon: string;
  route: string;
}

const pageButtons: PageButton[] = [
  {
    name: "Home",
    icon: "i-bxs-home",
    route: "/",
  },
  {
    name: "Game Assets",
    icon: "i-bxs-cube",
    route: "/game-assets",
  },
  {
    name: "Content Assets",
    icon: "i-bx-cube",
    route: "/content-assets",
  },
  {
    name: "Maps",
    icon: "i-bx-map-alt",
    route: "/maps",
  },
];
</script>

<style scoped></style>
