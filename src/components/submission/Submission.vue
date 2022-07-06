<template>
<div class="mt-4 container">
    <table class="table text-center">
        <tbody>
            <tr><SubmissionRow :submission="submission"></SubmissionRow></tr>
        </tbody>
    </table>
    <div class="card" v-for="(item, index) in submission.preview" :key="index">
        <div class="card-header">{{FileTypeName[submconfig[index].Accepted]}}: {{index}}</div>
        <div class="card-body"><Codemirror :value="item" :options="cmOptions" border></Codemirror></div>
    </div>
    <div class="card mt-4">
        <div class="card-header">Status Details</div>
        <div class="card-body">
            <div class="accordion" id="result_data">
                <div class="accordion-item" v-for="(sub, index) in submission.result.Subtask" :key="index" v-if="submission.result.IsSubtask">
                    <h2 class="accordion-header">
                        <button :class="'accordion-button collapsed btn result-' + (isSubAC(sub) ? 'success' : 'failed')" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse_data_subtask' + index">
                            Subtask #{{index}}: {{getSubScore(sub)}}/{{sub.Fullscore}}pts
                        </button>
                    </h2>
                    <div :id="'collapse_data_subtask' + index" class="accordion-collapse collapse" data-bs-parent="#result_data">
                        <div class="accordion-body">
                            <TestcaseAccordion :testcases="sub.Testcase" :sub_index="'result_data_subtask' + index"></TestcaseAccordion>
                        </div>
                    </div>
                </div>
                <template v-else-if="submission.result.IsSubtask == false">
                    <TestcaseAccordion :testcases="submission.result.Subtask[0].Testcase" sub_index="result_data"></TestcaseAccordion>
                </template>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { submissionRow } from './submission.js'
import { callAPI } from '@/utils'
import { CalcMethod, FileTypeName } from '@/config'
import TestcaseAccordion from './TestcaseAccordion.vue'

import Codemirror from 'codemirror-editor-vue3'
// plugin-style
import "codemirror-editor-vue3/dist/style.css";
// language
import "codemirror/mode/nginx/nginx.js"
// theme
import "codemirror/theme/dracula.css"

export default {
    components: {
        SubmissionRow: {
            props: ['submission'],
            render() {
                return submissionRow(this.submission)
            },
        },
        TestcaseAccordion,
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
                result: {},
                preview: {},
            },
            calcmethod: 0,
            submconfig: {},
            FileTypeName: FileTypeName,
            cmOptions: {
                mode: 'text/x-cpp', // Language mode
                theme: props.theme || 'dracula', // Theme
                lineNumbers: true, // Show line number
                smartIndent: true, // Smart indent
                indentUnit: 4, // The smart indent unit is 2 spaces in length
                foldGutter: true, // Code folding
                matchBrackets: true,
                autoCloseBrackets: true,
                styleActiveLine: true, // Display the style of the selected row
                readOnly: props.readOnly,
            }
        }
    },
    created() {
        callAPI('submission', 'get', { submission_id: this.id }, (res) => {
            this.submission = res.data.submission
            this.submission.result = this.submission.result == "" ? {} : JSON.parse(this.submission.result)
            this.submission.preview = this.submission.preview == "" ? {} : JSON.parse(this.submission.preview)
            this.calcmethod = res.data.calcmethod
            this.submconfig = res.data.submconfig
            console.log(this.submission, this.submconfig)
        }, (res) => {
            alert(res.data._error)
        })
    },
    methods: {
        isSubAC(sub) {
            if (CalcMethod[this.calcmethod] != 'MAX') {
                for (var key in sub.Testcase)  {
                    if (sub.Testcase[key].Fullscore > sub.Testcase[key].Score) {
                        return false
                    }
                }
                return true
            } else {
                for (var key in sub.Testcase)  {
                    if (sub.Testcase[key].Fullscore == sub.Testcase[key].Score) {
                        return true
                    }
                }
                return false
            }
        },
        getSubScore(sub) {
            switch(CalcMethod[this.calcmethod]) {
            case 'MIN':
                return Math.min.apply(Math, sub.Testcase.map((x) => x.Score))
            case 'MAX':
                return Math.max.apply(Math, sub.Testcase.map((x) => x.Score))
            case 'SUM':
                var sum = 0
                for (var i of sub.Testcase) sum += i.Score
                return sum
            }
        },
    }
}
</script>

<style>
.result-success {
    color: #fff;
    background-color: #25AD40!important;
}
.result-failed {
    color: #fff;
    background-color: #CC2020!important;
}
.result-success:not(.collapsed) {
    color: #fff;
}
.result-failed:not(.collapsed) {
    color: #fff;
}
</style>