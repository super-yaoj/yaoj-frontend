<template>
  <div class="mt-5 row">
    <div class="col-lg-4 col-sm-5 col-12 mx-auto mb-3">
      <div class="rounded-2" style="overflow: hidden"><img src="/icons/default_icon.svg" /></div>
      <div class="mt-2 d-flex" style="font-size:1.5rem">
        <div class="me-1">
          <ion-icon name="male-outline" class="info-gender-icon" style="color:#66F" v-if="user.gender == 1" />
          <ion-icon name="female-outline" class="info-gender-icon" style="color:#F66" v-if="user.gender == 2" />
        </div>
        <UserName :id="user.user_id" :name="user.user_name" :rating="user.rating" />
      </div>
      <div class="small" style="color:gray;word-wrap:break-word">{{ user.motto }}</div>
      <router-link v-if="user.user_id == $store.user.user_id" class="mt-2 mb-2 btn btn-sm btn-outline-secondary d-block"
        role="button" :to="`/user/${user.user_id}/modify/`">Edit Profile</router-link>
      <ul v-if="user.user_id" class="list-group list-group-flush" style="word-wrap:break-word">
        <UserInfoMeta title="User ID" icon="id-card">ID #{{ user.user_id }}</UserInfoMeta>
        <UserInfoMeta title="Rating" icon="bar-chart">
          <UserName style="display: inline-block;" :id="user.user_id" :name="user.rating + ''" :rating="user.rating" />
        </UserInfoMeta>
        <UserInfoMeta title="User Group" icon="people">{{ user.user_group }}</UserInfoMeta>
        <UserInfoMeta title="Register Time" icon="time">{{ user.register_time }}</UserInfoMeta>
        <UserInfoMeta v-if="user.email" title="Email" icon="mail">{{ user.email }}</UserInfoMeta>
        <UserInfoMeta v-if="user.organization" title="Organization" icon="briefcase">{{ user.organization }}
        </UserInfoMeta>
      </ul>
    </div>
    <div class="col-12 col-sm-7 col-lg-8">
      <TabView ref="tabs">
        <TabPane name="Rating">
          <Rating :register_time="user.register_time" v-if="user.user_id" />
        </TabPane>
        <TabPane name="Accepted">
        </TabPane>
        <TabPane name="Blogs">
          <div class="mt-3">
            <h5>Drafts</h5>
            <DataTable :dataprovider="draft_option" tableclass="table table-hover" ref="drafts" />
            <h5>Blogs</h5>
            <DataTable :dataprovider="blog_option" tableclass="table table-hover" />
          </div>
        </TabPane>
        <TabPane v-if="canSeePermission" name="Permissions">
          <div class="mt-3">
            <ul class="list-group">
              <li class="list-group-item" v-for="item in permission_list" :key="item.permission_id">
                <span class="badge bg-secondary me-1">#{{ item.permission_id }}</span>
                <span>{{ item.permission_name }}</span>
              </li>
            </ul>
          </div>
        </TabPane>
      </TabView>
    </div>
  </div>
</template>

<script>
import Table from '@/models/Table.vue'
import ClickLike from '@/models/ClickLike.vue'
import UserName from '@/models/UserName.vue'
import { DataTable, TabPane, TabView } from '@/core'
import Rating from './Rating.vue'
import UserInfoMeta from './UserInfoMeta.vue'

import { call, callAPI, queryUser } from '@/utils'
import { blog_table, removeDraft } from '../blog/blog'
import { noPaging } from '@/core/DataTable'


export default {
  name: "UserInfo",
  inject: ['isAdmin'],
  data() {
    return {
      permission_list: [],
      user: {},
      id: this.$route.params.id,
      timestamp: 0,
      blog_option: {
        head: blog_table.filter(col => col.name != 'author'),
        paging: noPaging(),
        fetch: async () => {
          try {
            let res = await call("/blogs", "GET", { param: { user_id: this.id } });
            if (res.data.data == null) {
              res.data.data = []
            }
            res.data.data = res.data.data.reverse()
            return [res.data.data, res.data.isfull]
          } catch (e) {
            console.log(e)
          }
        },
      },
      draft_option: {
        head: [{
          name: 'title', title: 'Title',
          renderer: (title, row) =>
            <RouterLink to={'/editblog?local=' + row.local}>
              <span style="color: red">[Draft] </span>
              {title}
            </RouterLink>
        }, {
          name: 'local', title: 'Operation',
          renderer: local =>
            <a onClick={this.deleteDraft(local)} href="#">delete</a>
        }],
        paging: noPaging(),
        fetch: async () => {
          let res = []
          if (this.id == this.$store.user.user_id) {
            for (var i = 0; i < localStorage.length; i++) {
              let key = localStorage.key(i)
              if (key.endsWith("_title")) {
                let local = key.substring(0, 16)
                res.push({
                  title: localStorage.getItem(local + "_title"),
                  local: local
                })
              }
            }
          }
          return [res, false]
        }
      },
    }
  },
  components: {
    Table,
    ClickLike,
    UserName,
    UserInfoMeta,
    Rating,
    UserName,
    TabView,
    TabPane,
    DataTable,
  },
  computed: {
    canSeePermission() {
      return this.id == this.$store.user.user_id || this.isAdmin()
    },
  },
  async created() {
    try {
      var id = this.id
      var res = await new Promise((res, rej) => {
        callAPI('user_permissions', 'get', { user_id: id }, res, rej)
      })
      this.permission_list = res.data.data || []
      return res.data
    } catch (e) {
      alert(e.data._error)
    }
  },
  methods: {
    fetchdata(route) {
      queryUser({ user_id: route.params.id }).then(data => {
        this.user = data
      })
      console.log("fetch", route)
      this.id = route.params.id
      this.$refs.tabs?.updatePane()
      this.$refs.drafts?.driver.fetch()
      this.timestamp = new Date().getTime()
    },
    deleteDraft(local) {
      return (event) => {
        event.preventDefault()
        removeDraft(local)
        this.timestamp = new Date().getTime()
        this.$refs.drafts?.driver.fetch()
      }
    }
  }
}
</script>

<style>
</style>