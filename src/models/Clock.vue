<template>
{{str}}
</template>

<script>
import { formatSeconds } from '@/utils'

export default {
    props: ['seconds'],
    data() {
        return { remain: this.seconds }
    },
    created() {
        setInterval(() => {
            --this.remain
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
    }
}
</script>