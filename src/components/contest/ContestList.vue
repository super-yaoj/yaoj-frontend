<template>
<div class="mt-4 container-md">
    <div class="row mb-3">
        <div class="col">
            <div class="h3 mb-0" v-t="'contests.title'" />
        </div>
        <div class="col" style="text-align:right;" v-if="isAdmin()">
            <button class="btn btn-sm btn-primary" @click="addContest" v-t="'contests.new'" />
            <div class="text-success small" v-if="success > 0">
                Successfully added, contest id: {{success}}.
            </div>
        </div>
    </div>
    <Table 
        :row="getLine" :sizes="[20, 50, 100]" :get="getContests"
        :next="getNext" :pagination="true"
        :timestamp="timestamp"
    />
</div>
</template>

<script>
import Table from '@/models/Table.vue'
import ClickLike from '@/models/ClickLike.vue'
import { callAPI } from '@/utils'
import { h, nextTick } from 'vue'
import { format } from 'silly-datetime'
import { getRule, getRegisterStatus, getStatus } from './contest.js'

export default {
    name: "ContestList",
    inject: ['isAdmin'],
    data() {
        return {
            success: "",
            timestamp: 0,
        }
    },
    components: {
        Table,
        ClickLike,
    },
    methods: {
        getLine(row) {
            if (row == null) return [
                h('td', { style: "width: 10%" }, h('strong', 'Operation')),
                h('td', { style: "width: 30%" }, h('strong', 'Contest Name')),
                h('td', { style: "width: 5%" }, h('strong', 'Rule')),
                h('td', { style: "width: 20%" }, h('strong', 'Start Time')),
                h('td', { style: "width: 10%" }, h('strong', 'Length')),
                h('td', { style: "width: 10%" }, h('strong', 'Status')),
                h('td', { style: "width: 10%" }, h('strong', 'Comments')),
            ]
            var reg = getRegisterStatus(row.register_status)
            var start = new Date(row.start_time), end = new Date(row.end_time), status = getStatus(start, end, row.finished)
            return [
                h('td', h('a', { href: "#", style: "color:" + reg.color, onClick: this.register(row.contest_id, row.register_status) }, reg.val)),
                h('td', {}, h('a', { href: "#/contest/" + row.contest_id }, row.title)),
                h('td', {}, getRule(row.pretest, row.score_private)),
                h('td', {}, format(start)),
                h('td', {}, (end - start) / 60000 + ' min'),
                h('td', {}, h('span', { style: "color:" + {"Not started": "green", "Running": "red", "Not finished": "blue", "Finished": "black"}[status] }, status)),
                h('td', h('div', { class: "row px-0 mx-0 justify-content-end" }, [
                        h('a', { class: "col px-0", href: "#/contest/" + row.contest_id + "/participants" }, [
                            h('ion-icon', { name: "people", style: "vertical-align: middle; font-size: 1rem; margin-right: 2px;" }, null),
                            h('span', { style: "vertical-align: middle;" }, row.registrants)
                        ]),
                        h(ClickLike, { class: "col px-0", icon: "thumbs-up-outline", number: row.like, target: { name: "contest", id: row.contest_id }, active: row.liked }),
                    ])
                ),
            ]
        },
        async getContests(query) {
            try {
                var res = await new Promise((res, rej) => {
                    callAPI('contests', 'get', query, res, rej)
                })
                console.log(res.data)
                return res.data
            } catch(e) {
                alert(e.data._error)
            }
        },
        getNext(a, b) {
            if (a == null) {
                return b < 0 ? 1 << 30 : 0;
            } else return a - b;
        },
        fetchdata() {
            this.timestamp = new Date().getTime()
        },
        // reload() {
        //     this.reloadContests = false
        //     nextTick(() => { this.reloadContests = true })
        // },
        addContest() {
            callAPI('contest', 'post', {}, (res) => {
                this.success = res.data.id
                this.fetchdata()
                // this.reload()
            }, (res) => {
                alert(res.data._error)
            })
        },
        register(id, status) {
            return (event) => {
                event.preventDefault()
                if (status == 0) return
                callAPI('contest_participants', status == 1 ? 'post' : 'delete', { contest_id: id }, (res) => {
                    this.fetchdata()
                    // this.reload()
                }, (res) => {
                    alert(res.data._error)
                })
            }
        }
    }
}
</script>