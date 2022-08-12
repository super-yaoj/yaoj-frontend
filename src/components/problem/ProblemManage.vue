<template>
  <TabView type="vertical">
    <TabPane :name="$t('problem.man.setting')">
      <div class="mx-3">
        <label class="form-label"><strong v-t="'problem.man.title'"></strong></label>
        <input class="form-control" id="title" v-model="title">

        <label class="form-label mt-5"><strong v-t="'problem.man.allow_downloads'"></strong></label>
        <table class="table table-bordered">
          <thead>
            <tr>
              <td><strong>File Name</strong></td>
              <td><strong>Path</strong></td>
              <td class="text-center"><input type="checkbox" class="form-check-input" v-model="downs_all"></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, id) in problem.statements" :key="id">
              <td>{{ item.name }}</td>
              <td>{{ item.path }}</td>
              <td class="text-center"><input type="checkbox" class="form-check-input" v-model="downs[id]"></td>
            </tr>
          </tbody>
        </table>
        <div class="text-center"><button class="btn btn-primary" @click="submitSetting">Submit</button></div>
      </div>
    </TabPane>
    <TabPane :name="$t('problem.man.permissions')">
      <div class="mx-3">
        <ManageTable url="problem_permissions" :data_name="['problem_id', 'permission_id', 'permission_name']"
          title="Permission" name="permission"></ManageTable>
      </div>
    </TabPane>
    <TabPane :name="$t('problem.man.managers')">
      <div class="mx-3">
        <ManageTable url="problem_managers" :data_name="['problem_id', 'user_id', 'user_name']" title="Manager"
          name="user"></ManageTable>
      </div>
    </TabPane>
    <TabPane :name="$t('problem.man.data')">
      <div class="mx-3">
        <label for="formFile" class="form-label"><strong v-t="'problem.man.upload_data'"></strong></label>
        <div class="d-flex flex-column flex-md-row">
          <div style="width: 100%" class="mb-1">
            <input class="form-control" type="file" id="formFile" accept=".zip" ref="dataFile">
          </div>
          <div class="btn-group ms-md-2 mb-1 align-self-stretch" role="group">
            <button class="btn btn-primary" style="min-width: 80px;" @click="uploadData" v-t="'submit'"></button>
            <a class="btn btn-info" style="min-width: 80px;" :href="downloadPath" v-if="problem.data.Subtasks"
              v-t="'download'"></a>
            <button class="btn btn-danger" style="min-width: 80px;" @click="rejudge"
              v-t="'problem.man.rejudge'"></button>
          </div>
        </div>
        <template v-if="problem.data.Subtasks">
          <PMDataView :data="problem.data.Pretest" title="Pretest" class="mt-4"></PMDataView>
          <PMDataView :data="problem.data" title="Data" class="mt-4"></PMDataView>
          <PMDataView :data="problem.data.Extra" title="Extra Data" class="mt-4"></PMDataView>
          <div class="mt-4 mb-1"><strong>Static Files</strong></div>
          <table class="table table-bordered">
            <tbody>
              <tr v-for="(item, index) in problem.data.Static" :key="index">
                <td><strong>{{ index }}</strong></td>
                <td>{{ item }}</td>
              </tr>
            </tbody>
          </table>
          <div class="mt-4 mb-1"><strong>Submission Config</strong></div>
          <table class="table table-bordered">
            <thead>
              <tr>
                <td><strong>File Name</strong></td>
                <td><strong>Accept File Type</strong></td>
                <td><strong>Accept Languages</strong></td>
                <td><strong>Max Length</strong></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in problem.subm_config" :key="index">
                <td>{{ index + (item.Accepted == 2 ? '(.lang)' : '') }}</td>
                <td>{{ FileTypeName[item.Accepted] }}</td>
                <td>{{ item.Accepted == 2 ? acceptLangs(item.Langs) : '/' }}</td>
                <td>{{ item.Length }}B</td>
              </tr>
            </tbody>
          </table>
        </template>
      </div>
    </TabPane>
  </TabView>
</template>

<script>
import { BASE_URL, Language, FileTypeName } from '@/config'
import ManageTable from '@/models/ManageTable.vue'
import { callAPI, callRPC, upload } from '@/utils'
import PMDataView from './PMDataView.vue'
import TabView from '../TabView.vue'
import TabPane from '../TabPane.vue'

export default {
  inject: ['reload'],
  props: ['problem', 'id'],
  data() {
    var downs = [], downs_all = true
    for (var key in this.problem.statements) {
      var cur = this.problem.allow_down[key] == '1'
      downs.push(cur)
      downs_all = downs_all && cur
    }
    return {
      downs_all: downs_all,
      downs: downs,
      title: this.problem.title,
      FileTypeName,
    }
  },
  components: {
    ManageTable,
    PMDataView,
    TabView,
    TabPane
  },
  methods: {
    submitSetting() {
      var str = ""
      for (var key in this.downs) str += this.downs[key] ? "1" : "0"
      callAPI('problem', 'patch', { problem_id: this.id, title: this.title, allow_down: str }, (res) => {
        this.reload()
      }, (res) => {
        alert(res.data._error)
      })
    },
    uploadData() {
      var file = this.$refs.dataFile.files[0]
      if (!file) {
        alert("You haven't chosen any file!")
        return
      }
      if (!file.name.endsWith(".zip")) {
        alert("You should upload zip file.")
        return
      }
      var formdata = new FormData()
      formdata.append("problem_id", this.id)
      formdata.append("data", file)
      upload('problem_data', 'put', formdata, (res) => {
        this.reload()
      }, (res) => {
        alert(res.response.data._error)
      })
    },
    acceptLangs(langs) {
      if (langs == null) return "All"
      var arr = []
      for (var key in langs) {
        arr.push(Language[langs[key]])
      }
      return arr.join(",")
    },
    rejudge() {
      if (confirm("Do you really want to rejudge?")) {
        callRPC('Rejudge', { problem_id: this.id }, (res) => {
          this.$router.push('/submissions?problem_id=' + this.id)
        }, (res) => {
          alert(res.data._error.message)
        })
      }
    },
  },
  computed: {
    downloadPath() {
      return BASE_URL + 'problem_data?type=data&problem_id=' + this.id
    },
  },
  watch: {
    downs_all() {
      for (var key in this.downs) {
        this.downs[key] = this.downs_all
      }
    }
  }
}
</script>

<style>
.accordion-button {
  font-size: .85rem;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
