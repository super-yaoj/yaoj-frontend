<template>
  <slot></slot>
</template>

<script setup>
const props = defineProps({
  name: String,
  type: String,
})

const emit = defineEmits({
  updatepane: null,
})

// onActivated(() => {
//   console.log('active', props.name)
//   emit('updatepane');
// })
// onDeactivated(() => {
//   console.log('deactive', props.name)
//   emit('updatepane');
// })
</script>