<template>
<div v-if="this.name" :class="this.class" :style="style">
    <router-link :to="'/user/' + id" @click="onClick">
        <span :style="'color:' + colorHead">{{name[0]}}</span>
        <span :style="'color:' + colorTail">{{name.substr(1)}}</span>
    </router-link>
</div>
</template>

<script>
export default {
    props: ['id', 'name', 'rating', 'class', 'style', 'onClick'],
    created() {
        console.log(this)
    },
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