<template>
<div class="mt-4 container-md">
    <div class="row align-items-end">
        <div class="col-2"></div>
        <h3 class="text-center col-8 mb-0">{{ contest.title }}</h3>
        <ClickLike class="col-2 text-right" icon="thumbs-up-outline" :number="contest.like" :target="{name:'contest',id:id}" :active="contest.liked"></ClickLike>
    </div>
    <ul class="nav nav-tabs mt-3">
        <li class="nav-item">
            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#dashboard" :value="id">Dashboard</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#standing" :value="id">Standing</button>
        </li>
        <li class="nav-item" role="presentation" v-if="can_edit">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#manage" :value="id">Manage</button>
        </li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane fade show active mt-3" id="dashboard">
            <div class="row px-2">
                <div class="col-md timeboard mb-3" >
                    <div class="card">
                        <div class="card-body text-center">
                            <div style="color:#666">Remaining Time:</div>
                            <h2>
                                <Clock :seconds="(contest.end_time - current_time) / 1000" v-if="contest.end_time > current_time" @end="contestEnd"/>
                                <span v-else-if="contest.finished">Ended</span>
                                <span v-else>Judging</span>
                            </h2>
                            <hr>
                            <div style="color:#666">Rule: {{rule}}<br>Max Rating Change: 0<br>Status: {{status}}</div>
                        </div>
                    </div>
                    <router-link class="btn btn-light mt-3" style="width:100%" :to="'/contest/' + id + '/participants'">Participants</router-link>
                    <router-link class="btn btn-info mt-3" style="width:100%" :to="'/submissions/?contest_id=' + id + '&submitter=' + $user.user_id" v-if="$user.user_id > 0">My submissions</router-link>
                    <button class="btn btn-danger mt-3" style="width:100%" v-if="can_edit && !contest.finished" @click="endContest">End Contest</button>
                </div>
                <div class="col-md">
                    <ManageTable url="contest_problems" :data_name="['contest_id', 'problem_id', 'title']" title="Problem" name="problem" :no-modify="!can_edit" :query="{contest_id:id}" />
                </div>
            </div>
        </div>
        <div class="tab-pane fade" id="standing">
            <ContestStanding />
        </div>
        <div class="tab-pane fade mt-3" id="manage" v-if="can_edit">
            <div class="d-flex align-items-start">
                <div class="nav flex-column nav-pills me-3">
                    <button class="nav-link active" data-bs-toggle="pill" data-bs-target="#v-pills-basic" :value="id">Basic</button>
                    <button class="nav-link" data-bs-toggle="pill" data-bs-target="#v-pills-permissions" :value="id">Permissions</button>
                    <button class="nav-link" data-bs-toggle="pill" data-bs-target="#v-pills-managers" :value="id">Managers</button>
                </div>
                <div class="tab-content container">
                    <div class="tab-pane fade show active" id="v-pills-basic">
                        <label class="ml-1"><strong>Contest Name:</strong></label>
                        <input class="form-control info-input-form" placeholder="Contest Name" v-model="newcontest.title" maxlength="80">
                        <hr>
                        <label class="ml-1"><strong>Start Time:</strong></label>
                        <input class="form-control info-input-form" placeholder="Start Time" v-model="newcontest.start_time" :disabled="contest.finished">
                        <label class="ml-1"><strong>Last:</strong></label>
                        <input class="form-control info-input-form" placeholder="End Time" v-model="newcontest.last" :disabled="contest.finished">
                        <hr>
                        <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                            <input type="checkbox" class="btn-check" id="btncheck1" autocomplete="off" v-model="newcontest.pretest" :disabled="contest.finished">
                            <label class="btn btn-outline-secondary" style="border-right:0px;" for="btncheck1">Pretest Only</label>
                            <input type="checkbox" class="btn-check" id="btncheck2" autocomplete="off" v-model="newcontest.score_private" :disabled="contest.finished">
                            <label class="btn btn-outline-secondary" for="btncheck2">Score Private</label>
                        </div>
                        <div class="text-center mt-1" @click="modifyContest"><button class="btn btn-primary">Submit</button></div>
                    </div>
                    <div class="tab-pane fade" id="v-pills-permissions">
                        <ManageTable url="contest_permissions" :data_name="['contest_id', 'permission_id', 'permission_name']" title="Permission" name="permission" />
                    </div>
                    <div class="tab-pane fade" id="v-pills-managers">
                        <ManageTable url="contest_managers" :data_name="['contest_id', 'user_id', 'user_name']" title="Manager" name="user" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { callAPI, callRPC } from '@/utils'
import ClickLike from '@/models/ClickLike.vue'
import Table from '@/models/Table.vue'
import ManageTable from '@/models/ManageTable.vue'
import ContestStanding from './ContestStanding.vue'
import Clock from '@/models/Clock.vue'
import { getRule, getStatus } from './contest'
import { format } from 'silly-datetime'

export default {
    inject: ['reload'],
    data() {
        return {
            id: this.$route.params.id,
            contest: { title: "", like: 0, liked: false, start_time: "", end_time: "", finished: false },
            can_edit: false,
            current_time: "",
            rule: "",
            status: "",
            newcontest: {},
            tasks: null,
        }
    },
    components: {
        ClickLike,
        Table,
        ManageTable,
        Clock,
        ContestStanding
    },
    created() {
        callAPI('contest', 'get', { contest_id: this.id }, (res) => {
            this.contest = res.data.contest
            this.contest.start_time = new Date(this.contest.start_time)
            this.contest.end_time = new Date(this.contest.end_time)
            
            this.can_edit = res.data.can_edit
            this.rule = getRule(this.contest.pretest, this.contest.score_private)
            this.status = getStatus(this.contest.start_time, this.contest.end_time, this.contest.finished)
            
            this.newcontest = {
                contest_id: this.id,
                title: this.contest.title,
                start_time: format(this.contest.start_time),
                last: Math.floor(this.contest.end_time - this.contest.start_time) / 60000,
                pretest: this.contest.pretest,
                score_private: this.contest.score_private,
            }
        })
        this.runtask()
        this.tasks = setInterval(this.runtask, 30000)
    },
    methods: {
        modifyContest() {
            var data = JSON.parse(JSON.stringify(this.newcontest))
            data.start_time = format(new Date(this.newcontest.start_time).getTime() + new Date().getTimezoneOffset() * 60 * 1000)
            data.pretest = this.newcontest.pretest ? 1 : 0
            data.score_private = this.newcontest.score_private ? 1 : 0
            callAPI('contest', 'patch', data, (res) => {
                this.reload()
            }, (res) => {
                alert(res.data._error)
            })
        },
        endContest() {
            callAPI('FinishContest', 'post', {contest_id: this.id}, (res) => {
                this.reload()
            }, (res) => {
                alert(res.data._error.message)
            })
        },
        runtask() {
            callRPC('GetTime', {}, (res) => {
                this.current_time = new Date(res.data.server_time)
            })
        },
        contestEnd() {
            alert("Contest Ended!")
            this.runtask()
        },
    },
    beforeUnmount() {
        clearInterval(this.tasks)
    },
}
</script>

<style>
.text-right {
    text-align: right;
    margin-bottom: 3px;
}
@media screen and (min-width: 768px) {
    .timeboard {
        max-width:250px;
    }
}
</style>