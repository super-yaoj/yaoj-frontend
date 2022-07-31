<template>
<div class="mt-4 container-md">
    <div class="row mb-3">
        <div class="h3 mb-0" v-t="'submissions.title'" />
    </div>
    <hr>
    <form class="row mb-3 subm-list-form flex-column flex-lg-row" @submit.prevent="query">
        <div class="input-group col flex-nowrap mb-1">
            <span class="input-group-text" id="basic-addon1" v-t="'submissions.filter.problem'" />
            <input type="text" class="form-control" placeholder="Problem id" v-model="problem_id">
        </div>
        <div class="input-group col flex-nowrap mb-1">
            <span class="input-group-text" id="basic-addon1" v-t="'submissions.filter.contest'" />
            <input type="text" class="form-control" placeholder="Contest id" v-model="contest_id">
        </div>
        <div class="input-group col flex-nowrap mb-1">
            <span class="input-group-text" id="basic-addon1" v-t="'submissions.filter.user'" />
            <input type="text" class="form-control" placeholder="User id" v-model="submitter">
        </div>
        <div class="btn-group col d-flex flex-row mb-1" style="text-align:right" v-if="$user.user_id > 0">
            <input type="checkbox" id="onlyme" class="btn-check" v-model="onlyme" style="display: none;">
            <label class="btn btn-outline-warning" for="onlyme" v-t="'submissions.filter.onlyme'" />
            <button class="btn btn-primary" type="submit" v-t="'search'" />
        </div>
    </form>
    <Table :row="getLine" :sizes="[10, 20, 50, 100]" :get="getSubmissions" :next="next" :pagination="true" v-if="reloadSubmissions" :nocache="true"></Table>
</div>
</template>

<script>
import Table from "@/models/Table.vue"
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
            return submissionRow(row)
        },
        async getSubmissions(query) {
            for (var key in this.$route.query)
                query[key] = this.$route.query[key]
            try {
                var res = await new Promise((res, rej) => {
                    callAPI('submissions', 'get', query, res, rej)
                })
                console.log(res.data)
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

<style>
</style>