<template>
<div class="mt-4 container">
    <div class="row align-items-end">
        <div class="col"></div>
        <h3 class="text-center col-10 mb-0">{{ '#' + id + '. ' + problem.title }}</h3>
        <ClickLike class="col text-right" icon="thumbs-up-outline" :number="problem.like" :target="{name:'problem',id:id}" :active="problem.liked"></ClickLike>
    </div>
    <div class="text-center mt-2">
        <span class="badge bg-success mx-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Time Limit">
            <ion-icon name="time" class="limitation-icon"></ion-icon> <span style="vertical-align:text-bottom">{{ problem.time_limit < 0 ? '/' : problem.time_limit }} ms</span>
        </span>
        <span class="badge bg-primary mx-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Memory Limit">
            <ion-icon name="hardware-chip" class="limitation-icon"></ion-icon> <span style="vertical-align:text-bottom">{{ problem.memory_limit < 0 ? '/' : problem.memory_limit }} MB</span>
        </span>
        <span class="badge bg-warning mx-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Submission Limit">
            <ion-icon name="reader" class="limitation-icon"></ion-icon> <span style="vertical-align:text-bottom">{{ maxSubmission }}</span>
        </span>
    </div>
    <ul class="nav nav-tabs mt-3">
        <li class="nav-item">
            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#statement" :value="id">Statement</button>
        </li>
        <li class="nav-item">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#submit" :value="id">Submit</button>
        </li>
        <li class="nav-item" v-if="problem.has_sample">
            <a class="nav-link" :href="download_path" :value="id">File Download</a>
        </li>
        <li class="nav-item">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tutorial" v-if="problem.tutorial_zh" :value="id">Tutorial</button>
        </li>
        <li class="nav-item" v-if="can_edit">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#manage" :value="id">Manage</button>
        </li>
        <li class="nav-item" v-if="!in_contest">
            <a class="nav-link" :href="'#/problem/' + id + '/statistic'" :value="id">Statistic</a>
        </li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane fade show active" id="statement">
            <v-md-preview :text="problem.statement_zh" />
        </div>
        <div class="tab-pane fade" id="submit">
            <ProblemSubmit :submission="problem.subm_config" />
        </div>
        <div class="tab-pane fade" id="tutorial" v-if="problem.tutorial_zh">
            <v-md-preview :text="problem.tutorial_zh" />
        </div>
        <div class="tab-pane fade mt-3" id="manage" v-if="can_edit">
            <ProblemManage :problem="problem" :id="id" />
        </div>
    </div>
</div>
</template>

<script>
import VMdPreview from '@/models/VMdPreview'
import ClickLike from '@/models/ClickLike.vue'
import ProblemManage from './ProblemManage.vue'
import ProblemSubmit from './ProblemSubmit.vue'
import { callAPI, tooltipInit } from '@/utils'
import { BASE_URL } from '@/config'

export default {
    data() {
        return {
            id: this.$route.params.id,
            contest_id: this.$route.query.contest_id,
            problem: {
                title: "",
                limitation: "",
                statement_zh: "",
                statement_en: "",
                tutorial_zh: "",
                tutorial_en: "",
                like: 0,
                liked: false,
                data: {},
            },
            can_edit: false,
            in_contest: true,
            download_path: BASE_URL + 'problem_data?type=sample&problem_id=' + this.$route.params.id + (this.$route.query.contest_id ? '&contest_id=' + this.$route.query.contest_id : ''),
        }
    },
    created() {
        callAPI('problem', 'get', { problem_id: this.id, contest_id: this.contest_id }, (res) => {
            this.problem = res.data.problem
            this.can_edit = res.data.can_edit
            this.in_contest = res.data.in_contest
            console.log(this.problem)
        }, (res) => {
            alert(res.data._error)
        })
    },
    mounted() {
        tooltipInit()
    },
    components: {
        VMdPreview,
        ClickLike,
        ProblemManage,
        ProblemSubmit,
    },
    computed: {
        maxSubmission() {
            var lim = -1
            for (var key in this.problem.subm_config) {
                var val = this.problem.subm_config[key]
                if (lim < 0) lim = val.Length
                else if (lim != val.Length) return 'Different'
            }
            lim /= 1024
            if (lim < 0) return '/'
            else if (lim < 1024) return Math.floor(lim) + " KB"
            else return Math.floor(lim / 1024) + "MB"
        }
    },
}
</script>

<style>
.text-right {
    text-align: right;
    margin-bottom: 3px;
}
.limitation-icon {
    font-size:.8rem;
    vertical-align:text-bottom;
}
</style>