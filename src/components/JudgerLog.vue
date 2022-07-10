<template>
{{log}}
</template>

<script>
import { callAPI } from '@/utils'

export default {
    data() {
        return { log: "" }
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