<template>
<div class="mt-4 container-md">
    <div class="h3">Custom Test</div>
    <div class="card mt-3">
        <div class="card-header">Your code & data</div>
        <div class="card-body px-4">
            <div class="row mb-1 align-items-center">
                <label class="col"><strong>Source code:</strong></label>
                <select class="form-select col" v-model="selectLang">
                    <option v-for="(val, index) in Language" :value="index" :key="index">{{val}}</option>
                </select>
                <div class="form-check col" style="text-align:right">
                    <input class="form-check-input me-1" type="checkbox" id="sourceCheckbox" value="" style="float:none" v-model="sourceByFile">
                    <label class="form-check-label" for="sourceCheckbox">
                        Upload file
                    </label>
                </div>
            </div>
            <textarea class="form-control" style="height:400px" :hidden="sourceByFile" v-model="code"></textarea>
            <input type="file" class="form-control" :hidden="!sourceByFile" id="sourceFile">
            <div class="small text-danger" v-if="emptySource">Your code is empty!</div>
            
            <div class="row mb-1 mt-3 align-items-center">
                <label class="col"><strong>Input file:</strong></label>
                <div class="form-check col" style="text-align:right">
                    <input class="form-check-input me-1" type="checkbox" id="inputCheckbox" value="" style="float:none" v-model="inputByFile">
                    <label class="form-check-label" for="inputCheckbox">
                        Upload file
                    </label>
                </div>
            </div>
            <textarea class="form-control" style="height:200px" :hidden="inputByFile" v-model="input"></textarea>
            <input type="file" class="form-control" :hidden="!inputByFile" id="inputFile">
            
            <div class="text-center mt-3">
                <button class="btn btn-primary" @click="submit">Submit</button>
                <div class="small" style="color:gray" :hidden="!waitHint">OK. Please wait... it may take a long period</div>
            </div>
        </div>
    </div>
    <div class="card mt-5" v-if="result.length">
        <div class="card-header">Result</div>
        <div class="card-body">
            <TestcaseAccordion sub_index="result" :testcases="result"></TestcaseAccordion>
        </div>
    </div>
</div>
</template>

<script>
import { Language } from '@/config'
import { upload } from '@/utils';
import TestcaseAccordion from './TestcaseAccordion.vue'

export default {
    data() {
        return {
            Language,
            selectLang: 0,
            code: "",
            input: "",
            sourceByFile: false,
            inputByFile: false,
            waitHint: false,
            emptySource: false,
            result: [],
        };
    },
    components: { TestcaseAccordion },
    methods: {
        submit() {
            this.emptySource = false
            var form = new FormData()
            form.append("source_lang", this.selectLang)
            if (this.sourceByFile) {
                var file = document.getElementById("sourceFile").files[0]
                if (!file) {
                    this.emptySource = true
                    return
                }
                form.append("source_file", file)
            } else {
                if (!this.code) {
                    this.emptySource = true
                    return
                }
                form.append("source_text", this.code)
            }
            if (this.inputByFile) {
                var file = document.getElementById("inputFile").files[0]
                if (!file) {
                    form.append("input_text", "")
                } else {
                    form.append("input_file", file)
                }
            } else {
                form.append("input_text", this.input)
            }
            this.waitHint = true
            upload('custom_test', 'post', form, (res) => {
                this.waitHint = false
                this.result[0] = JSON.parse(res.data.result)
                console.log(res.data)
            }, (res) => {
                alert(res.response.data._error)
            })
        },
    },
}
</script>