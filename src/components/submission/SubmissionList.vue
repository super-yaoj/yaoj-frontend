<template>
<div class="mt-4 container">
    <div class="row mb-3">
        <div class="h3 mb-0">Submission List</div>
    </div>
    <hr>
    <form class="row mb-3" @submit.prevent="query">
        <div class="input-group col">
            <span class="input-group-text" id="basic-addon1">Problem</span>
            <input type="text" class="form-control" placeholder="Problem id" v-model="problem_id">
        </div>
        <div class="input-group col">
            <span class="input-group-text" id="basic-addon1">Contest</span>
            <input type="text" class="form-control" placeholder="Contest id" v-model="contest_id">
        </div>
        <div class="input-group col">
            <span class="input-group-text" id="basic-addon1">Submitter</span>
            <input type="text" class="form-control" placeholder="User id" v-model="submitter">
        </div>
        <div class="col" style="text-align:right;max-width:120px;" v-if="$user.user_id > 0">
            <input type="checkbox" id="onlyme" class="btn-check" v-model="onlyme">
            <label class="btn btn-outline-warning" for="onlyme" style="max-width:100px">Only me</label>
        </div>
        <div class="col" style="text-align:right;max-width:100px;">
            <button class="btn btn-primary" type="submit">Search</button>
        </div>
    </form>
    <Table :row="getLine" :sizes="[10, 20, 50, 100]" :get="getSubmissions" :next="next" :pagination="true" v-if="reloadSubmissions" :nocache="true" />
</div>
</template>

<script>
import Table from "@/models/Table.vue"
import { h } from 'vue'
import { callAPI } from '@/utils'
import { submissionRow } from "./submission"

export default {
    components: {
        Table,
    },
    data() {
        return {
            reloadSubmissions: true,
            problem_id: this.$route.query.problem_id ? this.$route.query.problem_id : "",
            contest_id: this.$route.query.contest_id ? this.$route.query.contest_id : "",
            submitter: this.$route.query.submitter ? this.$route.query.submitter : "",
            onlyme: this.$user.user_id > 0 && this.$route.query.submitter == this.$user.user_id,
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
            for (var key in this.$route.query)
                query[key] = this.$route.query[key]
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
        query() {
            var q = {
                problem_id: this.problem_id == "" ? undefined : this.problem_id,
                contest_id: this.contest_id == "" ? undefined : this.contest_id,
                submitter: this.submitter == "" ? undefined : this.submitter,
            }
            this.$router.push({query: q})
        },
    },
    watch: {
        onlyme(to) {
            if (to) {
                this.submitter = this.$user.user_id
                this.query()
            } else {
                this.submitter = ""
                this.query()
            }
        }
    },
}
</script>