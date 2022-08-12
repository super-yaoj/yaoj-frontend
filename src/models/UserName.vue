<template>
  <router-link v-if="name" :to="`/user/${id}`">
    <span :style="{ color: colorHead }">{{ name.at(0) }}</span>
    <span :style="{ color: colorTail }">{{ name.substr(1) }}</span>
  </router-link>
</template>

<script>
export default {
  props: ['id', 'name', 'rating'],
  computed: {
    colorHead() {
      if (this.rating < 3000) return this.colorTail
      return 'black'
    },
    colorTail() {
      if (this.rating < 1200) return 'gray'
      if (this.rating < 1400) return 'green'
      if (this.rating < 1600) return '#03A89E'
      if (this.rating < 1900) return 'blue'
      if (this.rating < 2100) return '#a0a'
      if (this.rating < 2400) return '#FF8C00'
      return 'red'
    },
  }
}
</script>