<script setup>
const props = defineProps({
  icon: String,
  t: String,
  href: String,
})
</script>

<template>
  <li class="nav-item sidebar-nav">
    <router-link class="nav-link" :to="href">
      <ion-icon :name="icon" class="feather" />
      <span v-t="t"></span>
    </router-link>
  </li>
</template>