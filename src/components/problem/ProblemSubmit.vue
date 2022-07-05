<template>
<div class="container">
    <div class="mt-3" v-if="multiFile">
        Upload a zip file containing {{allFiles}}:
        <input type="file" class="form-control mt-1" ref="all" accept=".zip">
        <div class="text-center mt-3">
            <button class="btn btn-primary" style="min-width:100px" @click="submit(true)">Submit</button>
        </div>
        <hr>
        or upload them one by one:
    </div>
    <div class="mt-3" v-for="(val, index) in submission">
        <template v-if="val.Accepted != filetype.Binary">
            <div class="row mb-1 align-items-center">
                <label class="col"><strong>{{(val.Accepted == filetype.Text ? 'Text file: ' : 'Source code: ') + index}}</strong></label>
                <div class="col-3" v-if="val.Accepted == filetype.Code">
                    <select class="form-select" v-model="selectLang[index]" @change="changeLang(index)">
                        <option v-for="(val, index) in acceptLangs(val.Langs)" :value="index">{{val}}</option>
                    </select>
                </div>
                <div class="form-check col" style="text-align:right">
                    <input class="form-check-input me-1" type="checkbox" value="" :id="'checkbox_' + index" style="float:none" v-model="checkboxes[index]">
                    <label class="form-check-label" :for="'checkbox_' + index">
                        Upload file
                    </label>
                </div>
            </div>
            <textarea class="form-control" style="height:400px" :hidden="checkboxes[index]" v-if="!advancedEditor" v-model="editors[indnex]"></textarea>
            <div :id="'codeEdit_' + index" style="height:400px" :hidden="checkboxes[index]" v-else></div>
            <input type="file" class="form-control" :hidden="!checkboxes[index]" :ref="'file_' + index">
        </template>
        <template v-else>
            <label class="col mb-1"><strong>Binary file: {{index}}</strong></label>
            <input type="file" class="form-control">
        </template>
    </div>
    <div class="text-center mt-3">
        <button class="btn btn-primary" style="min-width:100px" @click="submit(false)">Submit</button>
    </div>
</div>
</template>

<script>
import { jsonLength, upload } from '@/utils'
import { Language, LangModel, FileType } from '@/config'
import { toRaw } from 'vue'

export default {
    props: ['submission', 'refresh'],
    data() {
        var checkboxes = {}, text = {}, editors = {}, selectLang = {}
        for (var key in this.submission) {
            checkboxes[key] = false
            text[key] = ""
            editors[key] = ""
            selectLang[key] = 0
        }
        return {
            id: this.$route.params.id,
            contest_id: this.$route.query.contest_id,
            multiFile: jsonLength(this.submission) > 1,
            checkboxes: checkboxes,
            text: text,
            editors: editors,
            selectLang: selectLang,
            advancedEditor: localStorage.getItem("advanced_editor"),
            monaco: null,
            filetype: FileType,
        }
    },
    mounted() {
        setTimeout(async () => {
            for (var key in this.submission) {
                this.selectLang[key] = ((json) => {
                    for (var key in json) return key
                })(this.acceptLangs(this.submission[key].Langs))
            }
            if (this.advancedEditor) {
                this.monaco = await import('monaco-editor')
                for (var key in this.submission) {
                    if (this.submission[key].Accepted[0] == 1) continue
                    this.editors[key] = this.monaco.editor.create(document.getElementById("codeEdit_" + key), {
                        value: '', //编辑器初始显示文字
                        language: LangModel[this.selectLang[key]], //此处使用的python，其他语言支持自行查阅demo
                        theme: 'vs-dark', //官方自带三种主题vs, hc-black, or vs-dark
                        selectOnLineNumbers: true,//显示行号
                        roundedSelection: false,
                        readOnly: false, // 只读
                        cursorStyle: 'line', //光标样式
                        automaticLayout: true, //自动布局
                        glyphMargin: true, //字形边缘
                        useTabStops: false,
                        fontSize: 14, //字体大小
                        autoIndent: true, //自动布局
                        quickSuggestionsDelay: 100, //代码提示延时
                    })
                }
            }
        }, 100)
    },
    computed: {
        allFiles() {
            var ret = "", start = true
            for (var key in this.submission) {
                if (!start) ret += ", "
                if (this.submission[key].Accepted == FileType.Code) {
                    ret += key + "(.lang)"
                } else ret += key
                start = false
            }
            return ret
        }
    },
    methods: {
        changeLang(index) {
            this.monaco.editor.setModelLanguage(this.editors[index].getModel(), LangModel[this.selectLang[index]])
        },
        acceptLangs(langs) {
            if (langs == null) return Language
            var ret = {}
            for (var i in langs) {
                ret[langs[i]] = Language[langs[i]]
            }
            return ret
        },
        submit(all) {
            var form = new FormData()
            form.append('problem_id', this.id)
            if (this.contest_id)
                form.append('contest_id', this.contest_id)
            if (all) {
                var file = this.$refs.all.files[0]
                if (!file) {
                    alert("You haven't chosen any file!")
                    return
                }
                if (!file.name.endsWith(".zip")) {
                    alert("You should upload zip file.")
                    return
                }
                form.append('all', file)
            } else {
                for (var key in this.submission) {
                    if (this.submission[key].Accepted == FileType.Code) {
                        form.append(key + "_lang", this.selectLang[key])
                    }
                    if (this.submission[key].Accepted != FileType.Binary && !this.checkboxes[key]) {
                        form.append(key + "_text", this.advancedEditor ? toRaw(this.editors[key]).getValue() : this.editors[key])
                    } else {
                        var file = this.$refs[key + "_file"].files[0]
                        if (!file) {
                            alert("You haven't chosen any file!")
                            return
                        }
                        form.append(key + "_file", file)
                    }
                }
            }
            upload('submission', 'post', form, (res) => {
                this.$temp_store['/submissions_table'] = undefined
                this.$router.push('/submissions')
            }, (res) => {
                alert(res.response.data._error)
            })
        },
    }
}
</script>