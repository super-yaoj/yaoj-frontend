<template>
  <div class="mt-4 container-md">
    <div class="row mb-3">
      <div class="col">
        <div class="h3 mb-0" v-t="'contests.title'"></div>
      </div>
      <div class="col" style="text-align:right;" v-if="isAdmin()">
        <button class="btn btn-sm btn-primary" @click="addContest" v-t="'contests.new'"></button>
        <div class="text-success small" v-if="success > 0">
          Successfully added, contest id: {{ success }}.
        </div>
      </div>
    </div>
    <DataTable :dataprovider="provider" ref="ctstlist" />
  </div>
</template>

<script lang="tsx">
import Table from '@/models/Table.vue'
import ClickLike from '@/models/ClickLike.vue'
import DataTable, { Option } from '@/core/DataTable'

import { callAPI } from '@/utils'
import { format } from 'silly-datetime'
import { getRule, getRegisterStatus, getStatus } from './contest.js'
import { RouterLink } from 'vue-router'
import { VIcon } from '@/core'

const StatusColor = {
  "Not started": "green",
  "Running": "red",
  "Not finished": "blue",
  "Finished": "black"
};

export default {
  name: "ContestList",
  inject: ['isAdmin'],
  data() {
    return {
      success: "",
      provider: {
        head: [{
          title: <strong>Operation</strong>, name: 'register_status',
          columnClass: 'w-10 text-center',
          renderer: (stat, o) => {
            let reg = getRegisterStatus(stat)
            return <a href="#" style={{
              color: reg.color,
            }} onClick={() => this.register(o.contest_id, stat)}>{reg.val}</a>
          },
        }, {
          title: <strong>Title</strong>, name: 'title',
          renderer: (title, o) => <RouterLink to={`/contest/${o.contest_id}`}>{title}</RouterLink>,
        }, {
          title: <strong>Rule</strong>, name: 'pretest',
          columnClass: 'w-05 text-center',
          renderer: (_, o) => getRule(o.pretest, o.score_private),
        }, {
          title: <strong>Start Time</strong>, name: 'start_time',
          style: 'width: 20%',
          renderer: (start_time) => format(new Date(start_time)),
        }, {
          title: <strong>Length</strong>, name: 'end_time',
          style: 'width: 10%',
          renderer: (_, o) => (Number(new Date(o.end_time)) - Number(new Date(o.start_time))) / 60000 + ' min',
        }, {
          title: <strong>Status</strong>, name: 'finished',
          style: 'width: 15%',
          renderer: (finished, o) => {
            const status = getStatus(new Date(o.start_time), new Date(o.end_time), finished)
            return <span style={{ color: StatusColor[status] }}>{status}</span>
          },
        }, {
          title: <strong>Comments</strong>, name: 'like',
          style: 'width: 10%',
          renderer: (_, o) => {
            return <div class="d-flex justify-content-between">
              <RouterLink to={`/contest/${o.contest_id}/participants`}>
                { /* @ts-ignore */}
                <VIcon name="people" style="vertical-align: middle; font-size: 1rem; margin-right: 2px;" />
                <span style="vertical-align: middle">{o.registrants}</span>
              </RouterLink>
              {/* @ts-ignore */}
              <ClickLike icon="thumbs-up-outline" number={o.like} target={{ name: "contest", id: o.contest_id }}
                active={o.liked} />
            </div>
          },
        }],
        paging: {
          beginKey: 1e9,
          endKey: 0,
          next: num => num - 1,
          prev: num => num + 1,
          sizes: [20, 50, 100],
          defaultsize: 20,
        },
        async fetch(ctxt) {
          let qry: any = { pagesize: ctxt.pagesize }
          if (ctxt.queryType === 'left') {
            qry.left = ctxt.queryKey
          } else {
            qry.right = ctxt.queryKey
          }
          try {
            var res: any = await new Promise((res, rej) => {
              callAPI('contests', 'get', qry, res, rej)
            })
            console.log(res.data)
            return [res.data.data, res.data.isfull]
          } catch (e) {
            alert(e.data._error)
          }
        },
      } as Option<number>,
    }
  },
  components: {
    Table,
    ClickLike,
    DataTable,
  },
  methods: {
    fetchdata() {
      this.$refs.ctstlist?.driver?.fetch()
    },
    addContest() {
      callAPI('contest', 'post', {}, (res) => {
        this.success = res.data.id
        this.fetchdata()
      }, (res) => {
        alert(res.data._error)
      })
    },
    register(id, status) {
      return (event) => {
        event.preventDefault()
        if (status == 0) return
        callAPI('contest_participants', status == 1 ? 'post' : 'delete', { contest_id: id }, (res) => {
          this.fetchdata()
        }, (res) => {
          alert(res.data._error)
        })
      }
    }
  }
}
</script>