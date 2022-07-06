<template>
<div class="mt-4 container">
    <div class="row mb-3">
        <div class="col">
            <div class="h3 mb-0">Submission List</div>
        </div>
    </div>
    <Table :row="getLine" :sizes="[10, 20, 50, 100]" :get="getSubmissions" :next="next" :pagination="true" v-if="reloadSubmissions" :nocache="noQuery"></Table>
</div>
</template>

<script>
import Table from "@/models/Table.vue"
import { h } from 'vue'
import { callAPI, jsonLength } from '@/utils'
import { submissionRow } from "./submission"

export default {
    components: {
        Table,
    },
    data() {
        return {
            reloadSubmissions: true,
            noQuery: jsonLength(this.$route.query) == 0,
        }
    },
    methods: {
        getLine(row) {
            if (row == null) return [
                h('td', h('strong', '#ID')),
                h('td', h('strong', 'Problem')),
                h('td', h('strong', 'Submitter')),
                h('td', h('strong', 'Score')),
                h('td', h('strong', 'Time')),
                h('td', h('strong', 'Memory')),
                h('td', h('strong', 'Language')),
                h('td', h('strong', 'Submit Time')),
            ]
            return submissionRow(row)
        },
        async getSubmissions(query) {
            try {
                var res = await new Promise((res, rej) => {
                    callAPI('submissions', 'get', query, res, rej)
                })
                return res.data
            } catch (e) {
                console.log(e)
            }
        },
        next(a, b) {
            if (a == null) return b > 0 ? 0 : 1 << 30
            return a.submission_id - b
        },
    },
}
</script>