<template>
{{str}}
</template>

<script>
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
            var hour = Math.floor(this.remain / 3600)
            var minite = Math.floor(this.remain / 60) % 60
            var second = Math.floor(this.remain) % 60
            return this.format(hour) + ":" + this.format(minite) + ":" + this.format(second)
        }
    },
    methods: {
        format(num) {
            var ret = "" + num
            while (ret.length < 2) {
                ret = "0" + ret
            }
            return ret
        }
    },
    watch: {
        seconds() {
            this.remain = this.seconds
        }
    }
}
</script>