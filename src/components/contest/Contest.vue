<template>
  <div class="mt-4 container-md">
    <div class="row align-items-end">
      <div class="col-2"></div>
      <h3 class="text-center col-8 mb-0">{{ contest.title }}</h3>
      <ClickLike class="col-2 text-right" icon="thumbs-up-outline" :number="contest.like"
        :target="{ name: 'contest', id: id }" :active="contest.liked" />
    </div>
    <TabView ref="tabs">
      <TabPane :name="$t('contest.dashboard')">
        <div class="mt-3">
          <div class="row px-2">
            <div class="col-md timeboard mb-3">
              <ContestTimeboard :id="id" :remainingtime="contest.end_time - current_time" :rule="rule" :status="status"
                :canedit="can_edit" :finished="contest.finished" @finish="contestEnd" @finalize="endContest" />
            </div>
            <div class="col-md">
              <ContestProblemTable :id="id" />
              <ContestAnnouncement :data="dashboard" @new="fetchNotice" />
            </div>
          </div>
        </div>
      </TabPane>
      <TabPane :name="$t('contest.standing')">
        <ContestStanding />
      </TabPane>
      <TabPane :name="$t('contest.manage')" v-if="can_edit">
        <TabView type="vertical" class="mt-3">
          <TabPane :name="$t('contest.man.setting')">
            <div class="ms-3">
              <label class="ml-1"><strong>Contest Name:</strong></label>
              <input class="form-control info-input-form" placeholder="Contest Name" v-model="newcontest.title"
                maxlength="80">
              <hr />
              <label class="ml-1"><strong>Start Time:</strong></label>
              <input class="form-control info-input-form" placeholder="Start Time" v-model="newcontest.start_time"
                :disabled="contest.finished">
              <label class="ml-1"><strong>Last:</strong></label>
              <input class="form-control info-input-form" placeholder="End Time" v-model="newcontest.last"
                :disabled="contest.finished">
              <hr />
              <div class="btn-group" role="group">
                <input type="checkbox" class="btn-check" id="btncheck1" autocomplete="off" v-model="newcontest.pretest"
                  :disabled="contest.finished">
                <label class="btn btn-outline-secondary" style="border-right:0px;" for="btncheck1">Pretest
                  Only</label>
                <input type="checkbox" class="btn-check" id="btncheck2" autocomplete="off"
                  v-model="newcontest.score_private" :disabled="contest.finished">
                <label class="btn btn-outline-secondary" for="btncheck2">Score Private</label>
              </div>
              <div class="text-center mt-1" @click="modifyContest"><button class="btn btn-primary">Submit</button>
              </div>
            </div>
          </TabPane>
          <TabPane :name="$t('contest.man.permissions')">
            <div class="ms-3">
              <ManageTable url="contest_permissions" :data_name="['contest_id', 'permission_id', 'permission_name']"
                title="Permission" name="permission" />
            </div>
          </TabPane>
          <TabPane :name="$t('contest.man.managers')">
            <div class="ms-3">
              <ManageTable url="contest_managers" :data_name="['contest_id', 'user_id', 'user_name']" title="Manager"
                name="user" />
            </div>
          </TabPane>
        </TabView>
      </TabPane>
    </TabView>
  </div>
</template>

<script lang="tsx">
import ClickLike from '@/models/ClickLike.vue'
import ManageTable from '@/models/ManageTable.vue'
import ContestStanding from './ContestStanding.vue'
import ContestAnnouncement from './ContestAnnouncement.vue'
import ContestProblemTable from './ContestProblemTable.vue'
import ContestTimeboard from './ContestTimeboard.vue'
import ContestList from './ContestList.vue'
import { TabPane, TabView } from '@/core'

import { callAPI, callRPC } from '@/utils'
import { getRule, getStatus } from './contest'
import { format } from 'silly-datetime'

const RefreshInterval = 30000
export default {
  name: 'Contest',
  inject: ['reload'],
  data() {
    return {
      id: this.$route.params.id,
      contest: { title: "", like: 0, liked: false, start_time: "", end_time: "", finished: false },
      can_edit: false,
      current_time: "",
      rule: "",
      status: "",
      newcontest: {},
      tasks: null,
      dashboard: [],
    }
  },
  components: {
    ClickLike,
    ManageTable,
    ContestStanding,
    ContestList,
    ContestAnnouncement,
    ContestProblemTable,
    ContestTimeboard,
    TabView,
    TabPane,
  },
  methods: {
    fetchdata(route) {
      if (this.tasks != null) {
        clearInterval(this.tasks)
      }
      callAPI('contest', 'get', { contest_id: route.params.id }, (res) => {
        this.id = route.params.id
        this.contest = res.data.contest
        this.contest.start_time = new Date(this.contest.start_time)
        this.contest.end_time = new Date(this.contest.end_time)

        this.can_edit = res.data.can_edit
        this.rule = getRule(this.contest.pretest, this.contest.score_private)
        this.status = getStatus(this.contest.start_time, this.contest.end_time, this.contest.finished)

        this.newcontest = {
          contest_id: this.id,
          title: this.contest.title,
          start_time: format(this.contest.start_time),
          last: Math.floor(this.contest.end_time - this.contest.start_time) / 60000,
          pretest: this.contest.pretest,
          score_private: this.contest.score_private,
        }
        this.$refs.tabs?.updatePane()
      })
      this.fetchNotice()
      this.tasks = setInterval(this.fetchNotice, RefreshInterval)
    },
    modifyContest() {
      var data = JSON.parse(JSON.stringify(this.newcontest))
      data.start_time = format(new Date(this.newcontest.start_time).getTime() + new Date().getTimezoneOffset() * 60 * 1000)
      data.pretest = this.newcontest.pretest ? 1 : 0
      data.score_private = this.newcontest.score_private ? 1 : 0
      callAPI('contest', 'patch', data, (res) => {
        this.fetchdata(this.$route)
      }, (res) => {
        alert(res.data._error)
      })
    },
    endContest() {
      callAPI('FinishContest', 'post', { contest_id: this.id }, (res) => {
        this.fetchdata(this.$route)
      }, (res) => {
        alert(res.data._error.message)
      })
    },
    fetchNotice() {
      callAPI('contest_dashboard', 'get', { contest_id: this.id }, (res) => {
        if (res.data.data != null) {
          this.dashboard = res.data.data.sort((a, b) => b.id - a.id)
          if (this.current_time) {
            for (var row of res.data.data) {
              if (new Date(row.time) > this.current_time) {
                alert("New Announcement!!!\n" + row.dashboard)
              }
            }
          }
        }
        callRPC('GetTime', {}, (res) => {
          this.current_time = new Date(res.data.server_time)
        })
      }, (res) => {
        alert(res.data._error)
      })
    },
    contestEnd() {
      alert("Contest Ended!")
      this.fetchNotice()
    },
  },
  beforeUnmount() {
    if (this.tasks != null) {
      clearInterval(this.tasks)
    }
  },
}
</script>

<style>
.text-right {
  text-align: right;
  margin-bottom: 3px;
}

@media screen and (min-width: 768px) {
  .timeboard {
    max-width: 250px;
  }
}
</style>