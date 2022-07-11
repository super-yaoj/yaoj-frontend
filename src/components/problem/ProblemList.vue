<template>
<div class="mt-4 container">
    <div class="row mb-3">
        <div class="col">
            <div class="h3 mb-0">Problem List</div>
        </div>
        <div class="col" style="text-align:right;" v-if="isAdmin()">
            <button class="btn btn-sm btn-primary" @click="addProblem">New Problem</button>
            <div class="text-success small" v-if="success > 0">
                Successfully added, problem id: {{success}}.
            </div>
        </div>
    </div>
    <Table :row="getLine" :sizes="[20, 50, 100]" :get="getProblems" :next="next" :pagination="true" v-if="reloadProblems"></Table>
</div>
</template>

<script>
import Table from '@/models/Table.vue'
import ClickLike from '@/models/ClickLike.vue'
import { h, nextTick } from 'vue'
import { callAPI } from '@/utils'

export default {
    inject: ['isAdmin'],
    data() {
        return {
            reloadProblems: true,
            success: 0,
        }
    },
    components: {
        Table,
        ClickLike,
    },
    methods: {
        getLine(row) {
            if (row == null) return [
                h('td', { style: "width:60px" }, h('strong', '#ID')),
                h('td', { style: "text-align:left;padding-left:30px!important" }, h('strong', 'Problem')),
                h('td', { style: "text-align:right;width:10%" }, h('strong', 'Comments')),
            ]
            return [
                h('td', { style: "" }, row.problem_id),
                h('td', { style: "text-align:left;padding-left:30px!important" }, h('a', { href: "#/problem/" + row.problem_id }, row.title)),
                h('td', { style: "text-align:right" }, h(ClickLike, { icon: "thumbs-up-outline", number: row.like, target: { name: "problem", id: row.problem_id }, active: row.liked }))
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
                this.reloadProblems = false
                nextTick(() => { this.reloadProblems = true })
            }, (res) => {
                alert(res.data._error)
            })
        },
    }
}
</script>

<style>
</style>