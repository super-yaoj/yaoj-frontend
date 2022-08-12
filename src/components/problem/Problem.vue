<template>
  <div class="mt-4 container">
    <div class="row align-items-end">
      <div class="col"></div>
      <h3 class="text-center col-10 mb-0">{{ '#' + id + '. ' + problem.title }}</h3>
      <ClickLike class="col text-right" icon="thumbs-up-outline" :number="problem.like"
        :target="{ name: 'problem', id: id }" :active="problem.liked"></ClickLike>
    </div>
    <div class="text-center mt-2">
      <ProblemBadge v-if="problem.time_limit > 0" icon="time" title="Time Limit" class="bg-success mx-1">
        {{ problem.time_limit }} ms
      </ProblemBadge>
      <ProblemBadge v-if="problem.memory_limit > 0" icon="hardware-chip" title="Memory Limit" class="bg-primary mx-1">
        {{ problem.memory_limit }} MB
      </ProblemBadge>
      <ProblemBadge v-if="maxSubmission !== '/'" icon="reader" title="Source Limit" class="bg-warning mx-1">
        {{ maxSubmission }}
      </ProblemBadge>
    </div>
    <div class="mt-1">
      <TabView ref="tabs">
        <TabPane name="Statement">
          <VMdPrewiew :text="problem.statement_zh" />
        </TabPane>
        <TabPane name="Submit">
          <ProblemSubmit :submission="problem.subm_config" />
        </TabPane>
        <TabPane name="File Download" v-if="problem.has_sample" type="link" :href="download_path" />
        <TabPane name="Tutorial" v-if="problem.tutorial_zh">
          <VMdPreview :text="problem.tutorial_zh" />
        </TabPane>
        <TabPane name="Manage" v-if="can_edit">
          <ProblemManage :problem="problem" :id="id" />
        </TabPane>
        <TabPane name="Statistic" v-if="!in_contest" type="link" :href="`#/problem/${id}/statistic`" />
      </TabView>
    </div>
  </div>
</template>

<script>
import VMdPreview from '@/models/VMdPreview'
import ClickLike from '@/models/ClickLike.vue'
import ProblemManage from './ProblemManage.vue'
import ProblemSubmit from './ProblemSubmit.vue'
import ProblemBadge from './ProblemBadge.vue'
import { callAPI } from '@/utils'
import { BASE_URL } from '@/config'
import TabView from '../TabView.vue'
import TabPane from '../TabPane.vue'

export default {
  name: "Problem",
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
  components: {
    VMdPreview,
    ClickLike,
    ProblemManage,
    ProblemSubmit,
    ProblemBadge,
    TabView,
    TabPane
  },
  methods: {
    fetchdata(newRoute) {
      callAPI('problem', 'get', { problem_id: newRoute.params.id, contest_id: this.contest_id }, (res) => {
        console.log('fetch!', res.data.problem)
        this.id = newRoute.params.id
        this.problem = res.data.problem
        this.can_edit = res.data.can_edit
        this.in_contest = res.data.in_contest
        this.$refs.tabs?.updatePane()
        // console.log(this.problem)
      }, (res) => {
        alert(res.data._error)
      })
    },
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
  font-size: .8rem;
  vertical-align: text-bottom;
}
</style>