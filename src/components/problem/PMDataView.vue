<template>
<div v-if="totalTests">
    <div class="row">
        <strong class="col">View {{title}}</strong>
        <div class="col" style="text-align:right">
            <span class="badge bg-secondary me-1" v-tooltip:bottom title="Stubask score calculating method" v-if="data.IsSubtask">{{CalcMethod[data.CalcMethod]}}</span>
            <span v-if="data.Fullscore" class="badge bg-success" v-tooltip:bottom title="Fullscore">{{data.Fullscore}}</span>
        </div>
    </div>
    <div class="accordion mt-1" id="subtasks" v-if="data.IsSubtask">
        <div class="accordion-item" v-for="sub in data.Subtasks" :key="sub.Id">
            <div class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + sub.Id">
                <div class="row" style="width:100%">
                    <div class="col"><strong>Subtask #{{sub.Id}}: {{sub.Fullscore}}pts</strong></div>
                    <div class="col" v-if="sub.Depend && sub.Depend.length > 0">
                        Dependence: {{sub.Depend.sort((a, b) => a - b).join(",")}}
                    </div>
                    <template v-for="(field, index) in sub.Field" :key="index">
                        <div class="col" v-if="index[0] != '_'">
                            {{index}}: {{field}}
                        </div>
                    </template>
                </div>
            </button>
            </div>
            <div :id="'collapse' + sub.Id" class="accordion-collapse collapse" data-bs-parent="#subtasks">
                <div class="accordion-body">
                    <TestInfoTable :subtask="sub.Tests"></TestInfoTable>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-1" v-else>
        <TestInfoTable :subtask="data.Subtasks[0].Tests"></TestInfoTable>
    </div>
</div>
</template>

<script>
import { CalcMethod } from '@/config'

export default {
    props: ['data', 'title'],
    components: {
        TestInfoTable: {
            props: ['subtask'],
            template:   
            `<table class="table table-bordered">
                <tbody>
                    <tr v-for="test in subtask" :key="test.Id">
                        <td><strong>Test #{{test.Id}}</strong></td>
                        <template v-for="(field, index) in test.Field" :key="index">
                            <td v-if="index[0] != '_'">
                                {{index}}: {{field}}
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>`,
        }
    },
    data() {
        return {
            CalcMethod,
        }
    },
    computed: {
        totalTests() {
            var sum = 0
            for (var val of this.data.Subtasks)
                sum += val.Tests == null ? 0 : val.Tests.length
            return sum
        }
    },
}
</script>