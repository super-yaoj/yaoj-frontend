<template>
  <header ref="mainNav" class="navbar navbar-dark sticky-top bg-dark flex-nowrap p-0 shadow">
    <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
      <span class="d-inline d-md-none pe-1"><label role="button" for="sidebar-toggler-checkbox"
          style="vertical-align: middle;">
          <ion-icon name="list-outline"></ion-icon>
        </label></span>
      Yao Online Judge
    </a>
    <form class="d-flex ms-2 me-2 mb-1 mt-1" action="/" @submit.prevent="onSubmit">
      <input class="form-control form-control-dark" placeholder="Search User" style="margin-right: 4px"
        v-model="user_name" />
      <button type="submit" class="btn btn-outline-light px-2" v-t="'search'" style="min-width: 50px;" />
    </form>
  </header>
  <div class="container-lg h-100" v-if="activeNow">
    <div class="row h-100">
      <the-sidebar :servertime="server_time" :reload="myReload" :refreshed="refreshed" />
      <CardModal class="modal-shadow" :display="searching" @close="searching = false">
        <template #header="{ close }">
          <h5 class="modal-title">Search result</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </template>
        <template #body>
          <DataTable :dataprovider="userlist" ref="userlist" />
        </template>
      </CardModal>
      <main role="main" class="col-md-9 col-lg-10 ms-sm-auto px-md-4">
        <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
          </keep-alive>
        </router-view>
        <footer style="height: 30px" />
      </main>
    </div>
  </div>
</template>

<script>
import TheSidebar from './components/TheSidebar.vue';
import DataTable from "./components/DataTable";
import CardModal from "./components/CardModal";

import { nextTick } from "vue";
import { format } from "silly-datetime";
import { callAPI, callRPC } from "./utils";
import { UserGroup } from "./config";
import { UserListData } from "./components/user/utils";

export default {
  data() {
    return {
      searching: false,
      activeNow: true,
      user_name: "",
      myModal: null,
      refreshed: false,
      server_time: '',
      userlist: {
        ...UserListData,
        paging: {
          beginKey: { user_id: 0 },
          endKey: { user_id: 1e9 },
          next: key => ({ user_id: key.user_id + 1 }),
          prev: key => ({ user_id: key.user_id - 1 }),
          sizes: [10],
          defaultsize: 10,
        },
        fetch: async ({ pagesize, queryType, queryKey }) => {
          var q = {
            pagesize,
            user_name: this.user_name
          }
          if (queryType == 'left') {
            q.left = queryKey.user_id;
          } else {
            q.right = queryKey.user_id;
          }
          try {
            var res = await new Promise((res, rej) => {
              callAPI("users", "get", q, res, rej);
            });
            console.log(res.data)
            return [res.data.data, res.data.isfull];
          } catch (e) {
            alert(e.data._error);
          }
        }
      }
    };
  },
  components: {
    TheSidebar,
    DataTable,
    CardModal,
  },
  created() {
    callRPC("GetTime", {}, (res) => {
      this.server_time = format(new Date(res.data.server_time));
    });
  },
  methods: {
    reloadApp() {
      callRPC("GetTime", {}, (res) => {
        this.server_time = format(new Date(res.data.server_time));
      });
      this.activeNow = false;
      nextTick(() => {
        this.activeNow = true;
      });
    },
    isAdmin() {
      return (
        this.$store.user.user_group == UserGroup.Admin ||
        this.$store.user.user_group == UserGroup.Root
      );
    },
    myReload() {
      this.reloadApp();
      this.refreshed = true;
      setTimeout(() => (this.refreshed = false), 1000);
    },
    async onSubmit() {
      await this.$refs.userlist?.driver?.fetch()
      this.searching = true
    },
  },
  provide() {
    return { reload: this.reloadApp, isAdmin: this.isAdmin };
  },
};
</script>