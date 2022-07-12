<template>
<div class="log">
    <p v-for="log in logs" :key="log">
        {{log}}
    </p>
</div>
</template>

<script>
import { callAPI } from '@/utils'

export default {
    data() {
        return { log: "" }
    },
    computed: {
        logs() {
            return JSON.parse(this.log).logs
        }
    },
    created() {
        callAPI('judgerlog', 'get', this.$route.query, (res) => {
            this.log = res.data.log
        }, (res) => {
            this.log = res.data._error
        })
    }
}
</script>

<style scoped>
.log p {
    font-family: 'Courier New', Courier, monospace;
    margin-bottom: 0;
}
</style>