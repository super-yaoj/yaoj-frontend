<template>
  <div :class="[
    type === 'vertical' && 'd-flex',
  ]">
    <div :class="[
      'nav',
      type === 'tab' && 'nav-tabs',
      type === 'vertical' && 'nav-pills flex-column',
    ]">
      <template v-for="pane in panes" :key="pane.key">
        <button v-if="pane.type === 'pane'" :class="['nav-link', activePaneName === pane.name && ' active']"
          @click="activePaneName = pane.name">
          {{ pane.name }}
        </button>
        <a v-else-if="pane.type === 'link'" :href="pane.href"
          :class="['nav-link', 'text-center', activePaneName === pane.name && ' active']">
          {{ pane.name }}
        </a>
      </template>
    </div>
    <div class="tab-content">
      <template v-for="pane in panes" :key="pane.key">
        <KeepAlive>
          <component v-if="activePaneName === pane.name" :is="pane.node" @updatepane="updatePane"></component>
        </KeepAlive>
      </template>
    </div>
  </div>
</template>

<script setup>
// assume that each tab has different name
import { ref, useSlots, watchEffect } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'tab'
  },
})

const slots = useSlots()

const getPanes = () => slots.default()
  .filter(node => node && node.props)
  .map(node => ({
    name: node.props.name || '',
    type: node.props.type || 'pane',
    href: node.props.href,
    key: node.props.key || node.props.name,
    node: node,
  }))

const panes = ref(getPanes())

const activePaneName = ref(panes.value[0]?.name || '')

watchEffect(() => {
  console.log(activePaneName.value)
})

const updatePane = () => {
  console.log('update pane!')
  panes.value = getPanes()
  console.log(panes.value)
}

defineExpose({
  // 由于当子元素不显示（deactivated）时无法检测其 v-if 条件的变化，因此需要手动 watch 来调用 updatePane
  updatePane,
})
</script>

<style>
.nav~.tab-content {
  width: 100%;
}
</style>