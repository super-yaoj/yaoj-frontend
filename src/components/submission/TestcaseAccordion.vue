<template>
<div class="accordion" :id="sub_index">
    <div class="accordion-item" v-for="(test, index) in testcases" :key="index">
        <h2 class="accordion-header">
            <button :class="'accordion-button collapsed btn result-' + (test.Score == test.Fullscore ? 'success' : 'failed')" type="button" data-bs-toggle="collapse" :data-bs-target="'#' + sub_index + '_test' + index">
                <div class="row" style="width:100%">
                    <div class="col">
                        Testcase #{{index}}: {{test.Score}}pts
                    </div>
                    <div class="col">
                        {{test.Title}}
                    </div>
                    <div class="col">
                        {{test.Time}} ms
                    </div>
                    <div class="col">
                        {{Math.floor(test.Memory / 1024)}} KB
                    </div>
                </div>
            </button>
        </h2>
        <div :id="sub_index + '_test' + index" class="accordion-collapse collapse" :data-bs-parent="'#' + sub_index">
            <div class="accordion-body">
                <template v-for="(file, i) in test.File" :key="i">
                    <label><strong>{{file.Title}}:</strong></label>
                    <div class="card text-dark bg-light mb-3 mt-1">
                        <div class="card-body">
                            {{cutContent(file.Content)}}
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { cutContent } from './submission.js'

export default {
    //sub_index: like "result_data_subtask1"
    props: ['testcases', 'sub_index'],
    methods: {
        cutContent(str) { return cutContent(str, 256) }
    }
}
</script>