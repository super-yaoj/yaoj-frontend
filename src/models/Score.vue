<template>
<span :style="'color:' + color">{{ score }}</span>
</template>

<script>
export default {
    props: ['score', 'fullscore'],
    computed: {
        color() {
            var full = this.fullscore == undefined ? 100 : this.fullscore
            var ratio = Math.max(0, Math.min(1, this.score / full))
            if (ratio <= 0.5) return 'rgb(200, ' + 400 * ratio + ', 0)'
            else return 'rgb(' + 400 * (1 - ratio) + ', 200, 0)'
        }
    }
}
</script>