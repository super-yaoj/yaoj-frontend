<template>
{{str}}
</template>

<script>
import { formatSeconds } from '@/utils'

export default {
    props: ['seconds'],
    emits: ['end'],
    data() {
        return { remain: Math.floor(this.seconds), task: null }
    },
    created() {
        this.task = setInterval(() => {
            --this.remain
            if (this.remain <= 0) {
                clearInterval(this.task)
                this.$emit('end')
            }
        }, 1000)
    },
    computed: {
        str() {
            return formatSeconds(this.remain)
        }
    },
    watch: {
        seconds() {
            this.remain = this.seconds
        }
    },
    beforeUnmount() {
        clearInterval(this.task)
    },
}
</script>