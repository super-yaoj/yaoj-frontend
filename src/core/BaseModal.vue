<script setup>
const props = defineProps({
  display: {
    type: Boolean,
    default: false,
  },
})

</script>

<template>
  <Teleport v-if="props.display" to="body">
    <div class="modal" v-bind="$attrs" style="display: block;">
      <slot></slot>
    </div>
  </Teleport>
</template>