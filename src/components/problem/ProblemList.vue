<template>
<div class="mt-4 container-md">
    <div class="row mb-3">
        <div class="col">
            <div class="h3 mb-0" v-t="'problems.title'" />
        </div>
        <div class="col" style="text-align:right;" v-if="isAdmin()">
            <button class="btn btn-sm btn-primary" @click="addProblem" v-t="'problems.new'" />
            <div class="text-success small" v-if="success > 0">
                Successfully added, problem id: {{success}}.
            </div>
        </div>
    </div>
    <Table 
        :row="getLine" :sizes="[20, 50, 100]" :get="getProblems" 
        :next="next" :pagination="true"
        :timestamp="this.timestamp"
    />
</div>
</template>

<script>
import Table from '@/models/Table.vue'
import ClickLike from '@/models/ClickLike.vue'
import { callAPI } from '@/utils'

export default {
    name: "ProblemList",
    inject: ['isAdmin'],
    data() {
        return {
            success: 0,
            timestamp: 0,
        }
    },
    components: {
        Table,
        ClickLike,
    },
    methods: {
        fetchdata() {
            this.timestamp = new Date().getTime()
        },
        getLine(row) {
            if (row == null) return [
                <td style="width:60px"><strong>#ID</strong></td>,
                <td style="text-align:left;padding-left:30px!important"><strong>Problem</strong></td>,
                <td style="width:10%"><strong>Comments</strong></td>,
            ]
            return [
                <td>{row.problem_id}</td>,
                <td style="text-align:left;padding-left:30px!important">
                    <a href={"#/problem/" + row.problem_id}>{row.title}</a>
                </td>,
                <td>
                    <ClickLike icon="thumbs-up-outline" number={row.like} target={{name: "problem", id: row.problem_id}} active={row.liked}></ClickLike>
                </td>
            ]
        },
        async getProblems(query) {
            try {
                var res = await new Promise((res, rej) => {
                    callAPI('problems', 'get', query, res, rej)
                })
                return res.data
            } catch(e) {
                alert(e.data._error)
            }
        },
        next(a, b) {
            if (a == null) {
                return b < 0 ? 0 : 1 << 30;
            } else return a.problem_id + b
        },
        addProblem() {
            callAPI('problem', 'post', {}, (res) => {
                this.success = res.data.id
                setTimeout(() => { this.success = 0 }, 1000)
                this.fetchdata()
                // this.reloadProblems = false
                // nextTick(() => { this.reloadProblems = true })
            }, (res) => {
                alert(res.data._error)
            })
        },
    }
}
</script>

<style>
</style>