<template>
</template>

<script setup>
import { call } from '@/utils'
import { onBeforeMount } from 'vue'

onBeforeMount(async () => {
  try {
    await call("/UserLogout", "POST");
    window.location.href = "/"
  } catch (e) {
    console.log(e)
  }
})

</script>