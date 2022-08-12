<template>
<div class="px-0 px-md-4 mt-4 container-lg">
    <BaseTable :head="subm_table" :data="[RenderData(subm_table, submission)]" />
    <div class="card" v-for="(item, index) in submission.details.content_preview" :key="index">
        <div class="card-header py-0">
            <div class="row align-items-center flex-column flex-md-row">
            <div class="col col-md-8 my-2">
                {{FileTypeName[item.Accepted]}}: {{index}}
            </div>
            <div class="col col-md-4 my-2" style="text-align:right" v-if="can_edit">
                <div class="btn-group" role="group" style="width: 100%">
                    <button type="button" class="btn btn-sm btn-warning" style="min-width:80px" @click="rejudge">Rejudge</button>
                    <button type="button" class="btn btn-sm btn-danger" style="min-width:80px" @click="remove">Delete</button>
                </div>
            </div>
            </div>
        </div>
        <div class="card-body">
            <Codemirror :value="item.Content" :options="cmOptions(item.Language)" border v-if="item.Accepted == FileType.Code" />
            <div class="card text-dark bg-light mb-3 mt-1" v-else>
                <div class="card-body">{{item}}</div>
            </div>
        </div>
    </div>
    <div class="card mt-4">
        <div class="card-header">Status Details</div>
        <div class="card-body">
            <SubtaskAccordion class="mt-1 mb-2" :result="submission.details.pretest_result" data_index="result_pretest" title="Pretests:" />
            <SubtaskAccordion class="mt-1 mb-2" :result="submission.details.result" data_index="result_data" title="Testcases:" />
            <SubtaskAccordion class="mt-1 mb-2" :result="submission.details.extra_result" data_index="result_extra" title="Extra Tests:" />
        </div>
    </div>
</div>
</template>

<script>
import { callAPI, callRPC } from '@/utils'
import { FileTypeName, LangModel, FileType } from '@/config'
import SubtaskAccordion from './SubtaskAccordion.vue'
import { BaseTable } from '@/core'
import { RenderData } from '@/core/DataTable'
import { subm_table } from './submission'

import Codemirror from 'codemirror-editor-vue3'
import "codemirror/mode/clike/clike.js"
import "codemirror/mode/go/go.js"
import "codemirror/mode/python/python.js"
import "codemirror/theme/dracula.css"

export default {
    name: 'Submission',
    inject: ['reload'],
    components: {
        BaseTable,
        SubtaskAccordion,
        Codemirror,
    },
    data() {
        return {
            id: this.$route.params.id,
            submission: {
                submission_id: this.$route.params.id,
                problem_id: 0,
                problem_name: "",
                contest_id: 0,
                score: 0,
                status: 0,
                submitter: 0,
                submitter_name: "",
                time: -1,
                memory: -1,
                language: -1,
                submit_time: "",
                details: { content_preview: "", result: "", pretest_result: "", extra_result: "" }
            },
            FileTypeName,
            FileType,
            can_edit: false,
            subm_table,
        }
    },
    methods: {
        RenderData,
        fetchdata(route){
            callAPI('submission', 'get', { submission_id: route.params.id }, (res) => {
                this.id = route.params.id
                this.submission = res.data.submission
                for (var key in this.submission.details) {
                    this.submission.details[key] = this.submission.details[key] == "" ? {} : JSON.parse(this.submission.details[key])
                }
                this.can_edit = res.data.can_edit
                console.log(this.submission)
            }, (res) => {
                alert(res.data._error)
            })
        },
        cmOptions(lang) {
            return {
                mode: LangModel[lang],
                theme: 'dracula',
                lineNumbers: true,
                readOnly: true,
            }
        },
        rejudge() {
            if (confirm("Do you really want to rejudge?")) {
                callRPC('Rejudge', {submission_id: this.id}, (res) => {
                    this.reload()
                }, (res) => {
                    alert(res.data._error.message)
                })
            }
        },
        remove() {
            if (confirm("Do you really want to delete?")) {
                callAPI('submission', 'delete', {submission_id: this.id}, (res) => {
                    this.$router.back()
                }, (res) => {
                    alert(res.data._error)
                })
            }
        },
    }
}
</script>