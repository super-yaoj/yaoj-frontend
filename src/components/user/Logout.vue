<template>
</template>

<script>
import { callRPC } from '@/utils'
import { onBeforeMount } from 'vue'

export default {
    setup() {
        onBeforeMount(() => callRPC("UserLogout", {}, function(response){ window.location.href = "/" }, function(response){}))
    }
}
</script>

<style>
</style>