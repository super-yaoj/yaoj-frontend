<template>
  <div class="mt-4 container-md">
    <CardModal class="modal-shadow" :display="adding_announcement" @close="adding_announcement = false">
      <template #header="{ close }">
        <h5 class="modal-title">Add new announcement</h5>
        <button type="button" class="btn-close" @click="close"></button>
      </template>
      <template #body>
        <div class="input-group mb-2">
          <span class="input-group-text">Blog ID</span>
          <input type="text" class="form-control" placeholder="number" v-model="blog_id" />
        </div>
        <div class="input-group">
          <span class="input-group-text">Priority</span>
          <input type="text" class="form-control" placeholder="1-10" v-model="priority" />
        </div>
      </template>
      <template #footer>
        <button type="button" class="btn btn-primary" @click="addAnouncement">Submit</button>
      </template>
    </CardModal>

    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between my-1">
          <div class="mb-0 h5" v-t="'announcements'"></div>
          <div v-if="isAdmin()" style="font-size:1.3rem; height:20px" @click="adding_announcement = true">
            <ion-icon name="add" style="--ionicon-stroke-width:50px; color:gray;" />
          </div>
        </div>
      </div>
      <div class="card-body pb-0" style="overflow-x: auto;">
        <DataTable ref="ancetable" :dataprovider="announcement_option" tableclass="table table-hover table-bt-1" />
      </div>
    </div>

    <div class="card mt-4">
      <div class="card-header">
        <div class="d-flex justify-content-between my-1">
          <div class="mb-0 h5" v-t="'top_rating'"></div>
          <router-link to="/users" style="margin-top:2px;">view all</router-link>
        </div>
      </div>
      <div class="card-body pb-0" style="overflow-x: auto;">
        <DataTable :dataprovider="userlist_option" tableclass="table table-hover table-bt-1" />
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import ClickLike from '@/models/ClickLike.vue'
import DataTable, { noPaging, Option } from '@/core/DataTable'
import { CardModal, TabPane, TabView } from '@/core'

import { format } from 'silly-datetime'
import { Top10Paging, UserListData, UserListKey } from './user/utils'
import { callAPI } from '@/utils'
import { RouterLink } from 'vue-router'

export default {
  inject: ['isAdmin'],
  data() {
    return {
      adding_announcement: false,
      blog_id: "",
      priority: "1",
      userlist_option: {
        ...UserListData,
        paging: Top10Paging,
      } as Option<UserListKey>,
      announcement_option: {
        head: [{
          name: 'title', title: <strong>Title</strong>,
          renderer: (title, o) => <RouterLink to={'/blog/' + o.blog_id}>{title}</RouterLink>,
        }, {
          name: 'release_time', title: <strong>Release Date</strong>,
          style: "width:15%",
          renderer: time => format(time, 'YYYY-MM-DD'),
        }, {
          name: 'comments', title: <strong>Comments</strong>,
          style: "width: 10%; text-align: right",
          renderer: (_, o) => <div class="d-flex justify-content-between">
            {/* @ts-ignore */}
            <ClickLike icon="chatbox-outline" number={o.comments} />
            {/* @ts-ignore */}
            <ClickLike icon="thumbs-up-outline" number={o.like} target={{ name: "blog", id: o.blog_id }} active={o.liked} />
          </div>,
        }, {
          display: this.isAdmin(),
          style: "width: 10%",
          name: 'priority', title: <strong>Priority</strong>,
          renderer: (priority, o) => <>{priority + " "}
            <a href="#" onClick={this.deleteAnnounce(o.id)}>Delete</a></>
        }],
        paging: noPaging(),
        async fetch() {
          try {
            var res: any = await new Promise((res, rej) => {
              callAPI('announcements', 'get', {}, res, rej)
            })
            if (res.data.data != null) {
              res.data.data.sort((a, b) => { return a.priority != b.priority ? b.priority - a.priority : b.id - a.id })
            }
            return [res.data.data, res.data.isfull]
          } catch (e) {
            alert(e.data._error)
          }
        },
      } as Option,
    }
  },
  components: {
    ClickLike,
    CardModal,
    DataTable,
    TabView,
    TabPane
},
  methods: {
    addAnouncement() {
      callAPI('announcements', 'post', { blog_id: this.blog_id, priority: this.priority }, (res) => {
        this.adding_announcement = false
        this.$refs.ancetable?.driver?.fetch()
      }, (res) => {
        alert(res.data._error)
      })
    },
    deleteAnnounce(id: any) {
      return (event) => {
        event.preventDefault()
        if (confirm("Do you really want to delete?")) {
          callAPI('announcements', 'delete', { id: id }, (res) => {
            this.$refs.ancetable?.driver?.fetch()
          }, (res) => {
            alert(res.data._error)
          })
        }
      }
    },
  }
}
</script>

<style>
</style>