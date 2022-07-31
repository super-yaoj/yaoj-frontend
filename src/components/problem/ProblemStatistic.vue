<template>
    <h3 class="text-center mt-4">{{ 'Problem #' + id + ': Statistics' }}</h3>
    <ul class="nav nav-tabs mt-3">
        <li class="nav-item">
            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#ac" :value="id">AC Submissions</button>
        </li>
        <li class="nav-item">
            <a class="nav-link" :href="'#/submissions?problem_id=' + id" :value="id">All Submissions</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" :href="'#/problem/' + id" :value="id">Back</a>
        </li>
    </ul>
    <div class="tab-content mt-4 container">
        <div class="row">
            <div class="col">
                <div class="progress" style="height:100%" v-tooltip:bottom :title="acnum + ' AC / ' + totnum + ' Total'">
                    <div class="progress-bar bg-success" role="progressbar" :style="'width:' + acratio + '%;min-width:20px'">{{ acratio }}%</div>
                </div>
            </div>
            <div class="col">
                <select class="form-select" @change="change" v-model="mode">
                    <option value="time" selected>Minimal Time</option>
                    <option value="memory">Minimal Memory</option>
                    <option value="length">Shortest Code</option>
                </select>
            </div>
        </div>
        <div class="tab-pane fade show active mt-3" id="ac">
            <Table :get="getStatistic" :row="getRow" :next="getNext" :pagination="true" :sizes="[10, 20, 50, 100]" v-if="refresh"></Table>
        </div>
    </div>
</template>

<script>
import Table from '@/models/Table.vue'
import { callAPI } from '@/utils';
import { nextTick } from 'vue';
import { submissionRow } from '../submission/submission';

export default {
    data() {
        return {
            id: this.$route.params.id,
            acnum: 0,
            totnum: 0,
            refresh: true,
            mode: "time",
        };
    },
    components: {
        Table,
    },
    methods: {
        async getStatistic(query) {
            var data = {
                problem_id: this.id,
                mode: this.mode,
                pagesize: query.pagesize,
            }
            if (query.right == undefined) {
                data.left = query.left.value
                data.left_id = query.left.id
            } else {
                data.right = query.right.value
                data.right_id = query.right.id
            }
            try {
                var res = await new Promise((res, rej) => {
                    callAPI('problem_statistic', 'get', data, res, rej)
                })
                this.acnum = res.data.acnum
                this.totnum = res.data.totnum
                return res.data
            } catch(e) {
                console.log(e)
            }
        },
        getRow(row) {
            return submissionRow(row)
        },
        getNext(a, b) {
            if (a == null) {
                return b < 0 ? { value: 0, id: 0 } : { value: 1e9, id: 1e9 }
            } else {
                return { value: a.time, id: a.submission_id + b }
            }
        },
        change() {
            this.refresh = false
            nextTick(() => this.refresh = true)
        },
    },
    computed: {
        acratio() {
            return this.totnum == 0 ? 0 : Math.round(this.acnum / this.totnum * 100)
        },
    },
}
</script>