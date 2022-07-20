<template>
    <header
        ref="mainNav"
        class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow"
    >
        <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
            Yao Online Judge
        </a>
        <form
            class="row ms-2 me-2 mb-1 mt-1"
            action="/"
            @submit.prevent="showResult"
        >
            <input
                class="form-control form-control-dark col"
                placeholder="Search User"
                style="max-width: 300px; margin-right: 3px"
                v-model="user_name"
            />
            <button type="submit" class="btn btn-outline-light col-3 px-2">
                Search
            </button>
        </form>
    </header>
    <div class="container-lg h-100" v-if="activeNow">
        <div class="row h-100">
            <the-sidebar :servertime="server_time" :reload="myReload" :refreshed="refreshed" />
            <div class="modal fade" id="userModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                                Search result
                            </h5>
                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div class="modal-body">
                            <Table
                                :get="queryUsers"
                                :row="getRow"
                                :pagination="true"
                                :next="getNext"
                                v-if="reloadSearch"
                                :sizes="[20]"
                                :nocache="true"
                            />
                        </div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <main
                role="main"
                class="col-md-9 col-lg-10 ms-sm-auto px-md-4"
            >
                <router-view />
                <footer style="height: 30px" />
            </main>
        </div>
    </div>
</template>

<script>
import { nextTick, h } from "vue";
import { format } from "silly-datetime";
import Table from "./models/Table.vue";
import { callAPI, callRPC } from "./utils";
import { UserGroup } from "./config";
import { Modal } from "bootstrap";
import TheSidebar from './TheSidebar.vue';
import UserName from "./models/UserName.vue";

export default {
    data() {
        return {
            activeNow: true,
            user_name: "",
            reloadSearch: false,
            myModal: null,
            refreshed: false,
            server_time: format(new Date(this.$time)),
        };
    },
    components: {
        Table,
        TheSidebar,
    },
    methods: {
        reloadApp() {
            callRPC("GetTime", {}, (res) => {
                this.$time = res.data.server_time;
                this.server_time = format(new Date(this.time));
            });
            this.activeNow = false;
            nextTick(() => {
                this.activeNow = true;
            });
        },
        isAdmin() {
            return (
                this.$user.user_group == UserGroup.Admin ||
                this.$user.user_group == UserGroup.Root
            );
        },
        myReload() {
            this.reloadApp();
            this.refreshed = true;
            setTimeout(() => (this.refreshed = false), 1000);
        },
        showResult() {
            this.myModal = Modal.getOrCreateInstance(
                document.getElementById("userModal")
            );
            this.myModal.show();
            this.reloadSearch = false;
            nextTick(() => {
                this.reloadSearch = true;
            });
        },
        hideResult(event) {
            this.myModal.dispose();
            document.body.removeAttribute("class");
            document.body.removeAttribute("style");
        },
        getRow(row) {
            if (row == null)
                return [
                    h("td", h("strong", "#ID")),
                    h("td", h("strong", "Username")),
                ];
            return [
                h("td", row.user_id),
                h("td", h(UserName, {id: row.user_id, name: row.user_name, rating: row.rating, onClick: this.hideResult})),
            ];
        },
        async queryUsers(query) {
            query.user_name = this.user_name;
            try {
                var res = await new Promise((res, rej) => {
                    callAPI("users", "get", query, res, rej);
                });
                console.log(res.data)
                return res.data;
            } catch (e) {
                alert(e.data._error);
            }
        },
        getNext(a, b) {
            if (a == null) return b > 0 ? 1 << 30 : 0;
            return a.user_id + b;
        },
    },
    watch: {
        $route() {
            this.reloadApp();
        },
    },
    provide() {
        return { reload: this.reloadApp, isAdmin: this.isAdmin };
    },
};
</script>