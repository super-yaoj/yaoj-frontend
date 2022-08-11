<template>
  <div class="nav nav-tabs">
    <template v-for="pane in panes" :key="pane.name">
      <button v-if="pane.type === 'pane'" :class="['nav-link', activePaneName === pane.name && ' active']"
        @click="activePaneName = pane.name">
        {{ pane.name }}
      </button>
      <a v-else-if="pane.type === 'link'" :href="pane.href"
        :class="['nav-link', activePaneName === pane.name && ' active']">
        {{ pane.name }}
        </a>
    </template>
  </div>
  <div class="tab-content">
    <template v-for="pane in panes" :key="pane.name">
      <KeepAlive>
        <component v-if="activePaneName === pane.name" :is="pane.node" @updatepane="updatePane"></component>
      </KeepAlive>
    </template>
  </div>
</template>

<script setup>
// assume that each tab has different name
import { ref, useSlots, watchEffect } from 'vue';

const slots = useSlots()
const panes = ref(slots.default()
  .filter(node => node && node.props)
  .map(node => ({
    name: node.props.name || '',
    type: node.props.type || 'pane',
    href: node.props.href,
    node: node,
  })))

const activePaneName = ref(panes.value[0]?.name || '')

watchEffect(() => {
  console.log(activePaneName.value)
})

const updatePane = () => {
  console.log('update pane!')
  panes.value = slots.default()
    .filter(node => node && node.props)
    .map(node => ({
      name: node.props.name || '',
      type: node.props.type || 'pane',
      href: node.props.href,
      node: node,
    }))
  console.log(panes.value)
}

defineExpose({
  // 由于当子元素不显示（deactivated）时无法检测其 v-if 条件的变化，因此需要手动 watch 来调用 updatePane
  updatePane,
})
</script>