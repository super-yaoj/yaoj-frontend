<template>
    <span class="badge" v-tooltip:bottom>
        <ion-icon :name="icon" class="limitation-icon"></ion-icon>
        <span style="vertical-align:text-bottom"><slot></slot></span>
    </span>
</template>

<script setup>
const props = defineProps({
    icon: String,
})
</script>