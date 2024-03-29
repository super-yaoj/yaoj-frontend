<template>
  <div class="container">
    <div class="mt-3" v-if="multiFile">
      Upload a zip file containing {{ allFiles }}:
      <input type="file" class="form-control mt-1" ref="all" accept=".zip">
      <div class="text-center mt-3">
        <button class="btn btn-primary" style="min-width:100px" @click="submit(true)">Submit</button>
      </div>
      <hr />
      or upload them one by one:
    </div>
    <div class="mt-3" v-for="(val, index) in submission" :key="index">
      <template v-if="val.Accepted != filetype.Binary">
        <div class="row mb-1 align-items-center">
          <label class="col"><strong>{{ (val.Accepted == filetype.Text ? 'Text file: ' : 'Source code: ') +
              index
          }}</strong></label>
          <div class="col-3" v-if="val.Accepted == filetype.Code">
            <select class="form-select" v-model="selectLang[index]" :id="'selectLang_' + index">
              <option v-for="(val, index) in acceptLangs(val.Langs)" :value="index" :key="index">{{ val }}
              </option>
            </select>
          </div>
          <div class="form-check col" style="text-align:right">
            <input class="form-check-input me-1" type="checkbox" value="" :id="'checkbox_' + index" style="float:none"
              v-model="checkboxes[index]">
            <label class="form-check-label" :for="'checkbox_' + index" v-t="'problem.uploadfile'"></label>
          </div>
        </div>
        <textarea class="form-control" style="height:400px" :hidden="checkboxes[index]"
          v-model="editors[index]"></textarea>
        <input type="file" class="form-control" :hidden="!checkboxes[index]" :id="'file_' + index">
      </template>
      <template v-else>
        <label class="col mb-1"><strong>Binary file: {{ index }}</strong></label>
        <input type="file" class="form-control">
      </template>
    </div>
    <div class="text-center mt-3">
      <button class="btn btn-primary" style="min-width:100px" @click="submit(false)" v-t="'submit'"></button>
    </div>
  </div>
</template>

<script>
import { jsonLength, upload } from '@/utils'
import { Language, FileType } from '@/config'

export default {
  props: ['submission'],
  data() {
    return {
      id: this.$route.params.id,
      contest_id: this.$route.query.contest_id,
      multiFile: jsonLength(this.submission) > 1,
      checkboxes: {},
      editors: {},
      selectLang: {},
      monaco: null,
      filetype: FileType,
    }
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
  async created() {
    while (this.submission == undefined) {
      await new Promise((res) => setTimeout(res, 20))
    }
    for (var key in this.submission) {
      while (document.getElementById('selectLang_' + key) == null) {
        await new Promise((res) => setTimeout(res, 20))
      }
      this.checkboxes[key] = false
      this.editors[key] = ""
      this.selectLang[key] = ((json) => {
        for (var key in json) return key
      })(this.acceptLangs(this.submission[key].Langs))
    }
  },
  methods: {
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
        form.append('all.zip', file)
        form.append('submit_all', true)
        upload('submission', 'post', form, (res) => {
          // this.$temp_store['/submissions_table'] = undefined
          this.$router.push('/submissions')
        }, (res) => {
          alert(res.response.data._error)
        })
      } else {
        for (var key in this.submission) {
          if (this.submission[key].Accepted == FileType.Code) {
            form.append(key + "_lang", this.selectLang[key])
          }
          if (this.submission[key].Accepted != FileType.Binary && !this.checkboxes[key]) {
            form.append(key + "_text", this.editors[key])
          } else {
            var file = document.getElementById("file_" + key).files[0]
            if (!file) {
              alert("You haven't chosen any file!")
              return
            }
            form.append(key + "_file", file)
          }
        }
        upload('submission', 'post', form, (res) => {
          // this.$temp_store['/submissions_table'] = undefined
          this.$router.push('/submissions')
        }, (res) => {
          alert(res.response.data._error)
        })
      }
    },
  },
}
</script>
