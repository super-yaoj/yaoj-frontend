<template>
    <div v-if="show">
        <label><strong>{{title}}</strong></label>
        <div class="accordion" :id="data_index" v-if="result.IsSubtask">
            <div class="accordion-item" v-for="(sub, index) in result.Subtask" :key="index">
                <h2 class="accordion-header">
                    <button :class="'accordion-button collapsed btn result-' + (isSubAC(sub) ? 'success' : 'failed')" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse_' + data_index + '_subtask' + index">
                        Subtask #{{index}}: {{getSubScore(sub)}}/{{sub.Fullscore}}pts
                    </button>
                </h2>
                <div :id="'collapse_' + data_index + '_subtask' + index" class="accordion-collapse collapse" :data-bs-parent="'#' + data_index">
                    <div class="accordion-body">
                        <TestcaseAccordion :testcases="sub.Testcase" :sub_index="data_index + '_subtask' + index"></TestcaseAccordion>
                    </div>
                </div>
            </div>
        </div>
        <TestcaseAccordion :testcases="result.Subtask[0].Testcase" :sub_index="data_index" v-else></TestcaseAccordion>
    </div>
</template>

<script>
import { CalcMethod } from '@/config'
import { jsonLength } from '@/utils'
import TestcaseAccordion from './TestcaseAccordion.vue'

export default {
    props: ['result', 'data_index', 'title'],
    components: {
        TestcaseAccordion,
    },
    methods: {
        isSubAC(sub) {
            if (CalcMethod[this.result.CalcMethod] != 'MAX') {
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
            switch(CalcMethod[this.result.CalcMethod]) {
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
    },
    computed: {
        show() { return jsonLength(this.result) > 0 }
    }
}
</script>