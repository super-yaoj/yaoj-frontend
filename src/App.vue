<template>
<header ref="mainNav" class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">Yao Online Judge</a>
    <form class="row ms-2 me-2 mb-1 mt-1" action="/" @submit.prevent="showResult">
        <input class="form-control form-control-dark col" placeholder="Search User" style="max-width:300px;margin-right:3px;" v-model="user_name">
        <button type="submit" class="btn btn-outline-light col-3 px-2">Search</button>
    </form>
    <button class="navbar-toggler d-md-none collapsed mx-2 mt-1 mb-1" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
</header>
<div class="container h-100">
<div class="row h-100">
<nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
    <div class="sidebar-sticky">
        <div class="container" id="sideNav">
            <div class="row">
            <ul class="nav flex-column">
                <nav-item icon="file-tray-full-outline" title="Problems" href="#/problems"></nav-item>
                <nav-item icon="hourglass-outline" title="Submissions" href="#/submissions"></nav-item>
                <nav-item icon="bar-chart-outline" title="Contests" href="#/contests"></nav-item>
                <nav-item icon="create-outline" title="Blogs" href="#/blogs"></nav-item>
                <div class="row">
                    <div class="col">
                        <nav-item icon="refresh-outline" title="Refresh" @click.prevent="myReload" href="#"></nav-item>
                    </div>
                    <div class="col-2" style="height:100%;padding-top:10px;" v-if="refreshed">
                        <ion-icon name="checkmark-circle-outline" style="font-size:1.1rem;color:green"></ion-icon>
                    </div>
                </div>
            </ul>
            </div>
            <hr />
            <div v-if="$user.user_id > 0">
                <div class="row">
                    <span class="col align-items-center px-3 text-muted" style="text-transform:uppercase;color:#444">{{$user.user_name}}</span>
                </div>
                <div id="userForm" class="row mt-2">
                    <ul class="nav flex-column">
                        <nav-item icon="newspaper-outline" title="Personal Information" :href="'#/user/' + $user.user_id"></nav-item>
                        <nav-item icon="pulse-outline" title="Custom Test" href="#/customtest"></nav-item>
                        <nav-item icon="build-outline" title="System Manage" href="#/manage" v-if="$user.user_group <= 1"></nav-item>
                        <nav-item icon="keypad-outline" title="Permission List" href="#/permissions" v-if="$user.user_group <= 1"></nav-item>
                        <nav-item icon="exit-outline" title="Log Out" href="#/logout"></nav-item>
                    </ul>
                </div>
            </div>
            <div v-else>
                <div class="row">
                    <h6 class="d-flex justify-content-between align-items-center px-3 mt-2 mb-1 text-muted" style="text-transform:uppercase">
                        <span style="color:#444">please login</span>
                    </h6>
                    </div>
                    <div class="row mt-2">
                    <ul class="nav flex-column">
                        <nav-item icon="enter-outline" title="Log In" href="#/login"></nav-item>
                        <nav-item icon="person-add-outline" title="Sign Up" href="#/signup"></nav-item>
                    </ul>
                </div>
            </div>
            <hr />
            <div class="row" style="text-align:center">
                <div class="px-3 col small" style="color:gray">
                    Yao Online Judge<br />
                    Server time: {{ server_time }}
                </div>
            </div>
        </div>
    </div>
</nav>
<div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Search result</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <Table :get="queryUsers" :row="getRow" :pagination="true" :next="getNext" v-if="reloadSearch" :sizes="[20]" :nocache="true"></Table>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
        </div>
    </div>
</div>
<main role="main" class="col-md-9 ms-sm-auto col-lg-10 px-md-4" ref="mainPart">
    <router-view v-if="activeNow"></router-view>
    <footer style="height:30px"></footer>
</main>
</div>
</div>
</template>

<script>
import { nextTick, h } from 'vue'
import { format } from 'silly-datetime'
import Table from './models/Table.vue'
import { callAPI, callRPC } from './utils'

export default {
    data() {
        return {
            activeNow: true,
            user_name: "",
            reloadSearch: false,
            myModal: null,
            refreshed: false,
            server_time: format(new Date(this.$time))
        }
    },
    components: {
        'nav-item': {
            props: ['icon', 'title', 'href'],
            template: `<li class="nav-item">
                <a class="nav-link" :href="href">
                <ion-icon :name="icon" class="feather"></ion-icon>
                <span>{{ title }}</span>
                </a>
            </li>`
        },
        Table,
    },
    methods: {
        reloadApp() {
            callRPC('GetTime', {}, (res) => {
                this.$time = res.data.server_time
                this.server_time = format(new Date(this.time))
            })
            this.activeNow = false
            nextTick(() => {
                this.activeNow = true
            })
        },
        myReload() {
            this.reloadApp()
            this.refreshed = true
            setTimeout(() => this.refreshed = false, 1000)
        },
        showResult() {
            this.myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('userModal'))
            this.myModal.show()
            this.reloadSearch = false
            nextTick(() => { this.reloadSearch = true })
        },
        hideResult(event) {
            this.myModal.dispose()
            document.body.removeAttribute("class")
            document.body.removeAttribute("style")
        },
        getRow(row) {
            if (row == null) return [
                h('td', h('strong', '#ID')),
                h('td', h('strong', 'Username')),
            ]
            return [
                h('td', row.user_id),
                h('td', h('a', { href: "#/user/" + row.user_id, onClick: this.hideResult }, row.user_name)),
            ]
        },
        async queryUsers(query) {
            query.user_name = this.user_name
            try {
                var res = await new Promise((res, rej) => {
                    callAPI('users', 'get', query, res, rej)
                })
                return res.data
            } catch (e) {
                alert(e.data._error)
            }
        },
        getNext(a, b) {
            if (a == null) return b > 0 ? 1 << 30 : 0;
            return a.user_id + b
        },
    },
    watch: {
        $route() { this.reloadApp() }
    },
    provide() {
        return { reload: this.reloadApp }
    }
}
</script>

<style>
#app {
    height: 90%;
}
</style>
