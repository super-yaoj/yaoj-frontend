<template>
<div class="mt-4">
    <table class="table table-hover" style="border-top: 1px solid #CCC">
        <thead><tr>
            <td style="width:10%;"><strong>Time</strong></td>
            <td ><strong>Announcement</strong></td>
            <td style="text-align:right">
                <a href="#" data-bs-toggle="modal" data-bs-target="#add_dashboard">
                    <ion-icon name="add-outline" style="font-size:1.2rem;vertical-align:text-bottom;color:gray;--ionicon-stroke-width:40px;"></ion-icon>
                </a>
            </td>
        </tr></thead>
        <tbody>
            <tr v-for="row in data" :key="row.id">
                <td>{{format(row.time, 'HH:mm:ss')}}</td>
                <td>{{row.dashboard}}</td>
                <td></td>
            </tr>
        </tbody>
    </table>
    <div class="modal fade" id="add_dashboard" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add Dashboard</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" />
            </div>
            <div class="modal-body">
                <textarea class="form-control" placeholder="Dashboard" v-model="add_dashboard" maxlength="200"></textarea>
                <label style="text-align:right;width:100%">({{ add_dashboard.length }}/200)</label>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="add">Submit</button>
            </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Table from '@/models/Table.vue'
import { callAPI } from '@/utils'
import { nextTick } from 'vue'
import { format } from 'silly-datetime'

export default {
    props: ['data'],
    emits: ['new'],
    data() {
        return {
            id: this.$route.params.id,
            add_dashboard: "",
            format,
        }
    },
    components: {
        Table,
    },
    methods: {
        async getData(query) {
            try {
                var res = await new Promise((res, rej) => {
                    callAPI('contest_dashboard', 'get', {contest_id: this.id}, res, rej)
                })
                return res.data
            } catch(e) {
                alert(e.data._error)
            }
        },
        add() {
            callAPI('contest_dashboard', 'post', {contest_id: this.id, dashboard: this.add_dashboard}, (res) => {
                this.$emit('new')
            }, (res) => {
                alert(res.data._error)
            })
        },
    }
}
</script>