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
                            <div class="text-secondary" v-t="'contest.remaining_time'" />
                            <h2>
                                <Clock v-if="contest.end_time > current_time" :seconds="(contest.end_time - current_time) / 1000" @end="contestEnd"/>
                                <span v-else-if="contest.finished" v-t="'contest.ended'" />
                                <span v-else v-t="'contest.judging'" />
                            </h2>
                            <hr />
                            <div class="text-secondary">
                                <div>Rule: {{rule}}</div>
                                <div>Max Rating Change: 0</div>
                                <div>Status: {{status}}</div>
                            </div>
                        </div>
                    </div>
                    <router-link class="btn btn-secondary mt-3 w-100" :to="'/contest/' + id + '/participants'">Participants</router-link>
                    <router-link class="btn btn-info mt-3 w-100" :to="'/submissions/?contest_id=' + id + '&submitter=' + $store.user.user_id" v-if="$store.user.user_id > 0">My submissions</router-link>
                    <button class="btn btn-danger mt-3 w-100" v-if="can_edit && !contest.finished" @click="endContest">End Contest</button>
                </div>
                <div class="col-md">
                    <ManageTable url="contest_problems" :data_name="['contest_id', 'problem_id', 'title']" title="Problem" name="problem" :no-modify="!can_edit" :query="{contest_id:id}" />
                    <ContestDashboard :data="dashboard" @new="runtask"></ContestDashboard>
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
                        <hr />
                        <label class="ml-1"><strong>Start Time:</strong></label>
                        <input class="form-control info-input-form" placeholder="Start Time" v-model="newcontest.start_time" :disabled="contest.finished">
                        <label class="ml-1"><strong>Last:</strong></label>
                        <input class="form-control info-input-form" placeholder="End Time" v-model="newcontest.last" :disabled="contest.finished">
                        <hr />
                        <div class="btn-group" role="group">
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
import ContestDashboard from './ContestDashboard.vue'
import Clock from '@/models/Clock.vue'
import { getRule, getStatus } from './contest'
import { format } from 'silly-datetime'
import ContestList from './ContestList.vue'

const RefreshInterval = 30000
export default {
    name: 'Contest',
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
            dashboard: [],
        }
    },
    components: {
        ClickLike,
        Table,
        ManageTable,
        Clock,
        ContestStanding,
        ContestList,
        ContestDashboard
    },
    methods: {
        fetchdata(route) {
            if (this.tasks != null) {
                clearInterval(this.tasks)
            }
            callAPI('contest', 'get', { contest_id: route.params.id }, (res) => {
                this.id = route.params.id
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
            this.tasks = setInterval(this.runtask, RefreshInterval)
        },
        modifyContest() {
            var data = JSON.parse(JSON.stringify(this.newcontest))
            data.start_time = format(new Date(this.newcontest.start_time).getTime() + new Date().getTimezoneOffset() * 60 * 1000)
            data.pretest = this.newcontest.pretest ? 1 : 0
            data.score_private = this.newcontest.score_private ? 1 : 0
            callAPI('contest', 'patch', data, (res) => {
                this.fetchdata(this.$route)
            }, (res) => {
                alert(res.data._error)
            })
        },
        endContest() {
            callAPI('FinishContest', 'post', {contest_id: this.id}, (res) => {
                this.fetchdata(this.$route)
            }, (res) => {
                alert(res.data._error.message)
            })
        },
        runtask() {
            callAPI('contest_dashboard', 'get', {contest_id: this.id}, (res) => {
                if (res.data.data != null) {
                    this.dashboard = res.data.data.sort((a, b) => b.id - a.id)
                    if (this.current_time) {
                        for (var row of res.data.data) {
                            if (new Date(row.time) > this.current_time) {
                                alert("New Announcement!!!\n" + row.dashboard)
                            }
                        }
                    }
                }
            callRPC('GetTime', {}, (res) => {
                this.current_time = new Date(res.data.server_time)
            })
            }, (res) => {
                alert(res.data._error)
            })
        },
        contestEnd() {
            alert("Contest Ended!")
            this.runtask()
        },
    },
    beforeUnmount() {
        if (this.tasks != null) {
            clearInterval(this.tasks)
        }
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