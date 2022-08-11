<template>
  <div class="nav nav-tabs">
    <button v-for="pane in panes" :key="pane.name" :class="['nav-link', activePaneName === pane.name && ' active']"
      @click="activePaneName = pane.name">
      {{ pane.name }}
    </button>
  </div>
  <div class="tab-content">
    <KeepAlive>
      <component :is="activePane" :key="activePane?.props.name"></component>
    </KeepAlive>
  </div>
</template>

<script setup>
// assume that each tab has different name
import { computed, ref, useSlots, watchEffect } from 'vue';

const slots = useSlots()
const panes = ref(slots.default()
  .filter(node => node && node.props)
  .map(node => ({ name: node.props.name || '', node: node })))

const activePaneName = ref(panes.value[0]?.name || '')
const activePane = computed(() => panes.value.find(pane => pane.name === activePaneName.value)?.node || null)

watchEffect(() => {
  console.log(activePaneName.value)
})

defineExpose({
  // 由于当子元素不显示（deactivated）时无法检测其 v-if 条件的变化，因此需要手动 watch 来调用 updatePane
  updatePane: () => {
    panes.value = slots.default()
      .filter(node => node && node.props)
      .map(node => ({ name: node.props.name || '', node: node }))
  },
})


</script>