<template>
    <li class="list-group-item info-item" v-tooltip:left>
        <VIcon :name="icon" class="feather me-2" />
        <slot></slot>
    </li>
</template>

<script setup>
import VIcon from '@/core/VIcon.vue';

defineProps({
    icon: String,
})
</script>