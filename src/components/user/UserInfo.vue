<template>
<div class="mt-5" style=""><div class="row">
<div class="col-lg-4 col-sm-5 col-12" style="max-width:300px">
    <div class="me-3">
    <div><img src="/icons/default_icon.svg" /></div>
    <div class="mt-2" style="font-size:1.5rem">
        <div style="float:left">
            <ion-icon name="male-outline" class="info-gender-icon" style="color:#66F" v-if="user.gender == 1">
            </ion-icon><ion-icon name="female-outline" class="info-gender-icon" style="color:#F66" v-if="user.gender == 2"></ion-icon>
        </div>
        <UserName :id="user.user_id" :name="user.user_name" :rating="user.rating"></UserName>
    </div>
    <div class="small" style="color:gray;word-wrap:break-word">{{user.motto}}</div>
    <a class="mt-2 mb-2 btn btn-sm btn-outline-secondary" role="button" :href="'#/user/' + user.user_id + '/modify/'" style="width:100%" v-if="user.user_id == $user.user_id">Modify Information</a>
    <ul class="list-group list-group-flush" style="word-wrap:break-word">
        <li class="list-group-item info-item" data-bs-toggle="tooltip" data-bs-placement="left" title="User Id">
            <ion-icon name="id-card" class="feather me-1"></ion-icon>
            ID #{{user.user_id}}
        </li>
        <li class="list-group-item info-item" data-bs-toggle="tooltip" data-bs-placement="left" title="Rating">
            <ion-icon name="bar-chart" class="feather me-2" style="float:left;margin-top:2px"></ion-icon>
            <UserName :id="user.user_id" :name="user.rating + ''" :rating="user.rating"></UserName>
        </li>
        <li class="list-group-item info-item" data-bs-toggle="tooltip" data-bs-placement="left" title="User Group">
            <ion-icon name="people" class="feather me-1"></ion-icon>
            {{user.user_group}}
        </li>
        <li class="list-group-item info-item" data-bs-toggle="tooltip" data-bs-placement="left" title="Register Time">
            <ion-icon name="time" class="feather me-1"></ion-icon>
            {{ user.register_time }}
        </li>
        <li class="list-group-item info-item" data-bs-toggle="tooltip" data-bs-placement="left" title="Email" v-if="user.email != ''">
            <ion-icon name="mail" class="feather me-1"></ion-icon>
            {{user.email}}
        </li>
        <li class="list-group-item info-item" data-bs-toggle="tooltip" data-bs-placement="left" title="Organization" v-if="user.organization != ''">
            <ion-icon name="briefcase" class="feather me-1"></ion-icon>
            {{user.organization}}
        </li>
    </ul>
    </div>
</div>
<div class="col-12 col-sm-7 col-lg-8">
    <div class="">
        <ul class="nav nav-tabs" id="myTab" role="tablist" style="flex-wrap: none;">
            <li class="nav-item" role="presentation">
                <button :class="'nav-link' + (tab == undefined || tab == 'rating' ? ' active' : '')" id="rating-tab"
                    data-bs-toggle="tab" data-bs-target="#rating" type="button" role="tab">Rating</button>
            </li>
            <li class="nav-item" role="presentation">
                <button :class="'nav-link' + (tab == 'accepted' ? ' active' : '')" id="accepted-tab"
                    data-bs-toggle="tab" data-bs-target="#accepted" type="button" role="tab">Accepted</button>
            </li>
            <li class="nav-item" role="presentation">
                <button :class="'nav-link' + (tab == 'blogs' ? ' active' : '')" id="blogs-tab"
                    data-bs-toggle="tab" data-bs-target="#blogs" type="button" role="tab">Blogs</button>
            </li>
            <li class="nav-item" role="presentation" v-if="canSeePermission">
                <button :class="'nav-link' + (tab == 'permissions' ? ' active' : '')" id="permission-tab"
                   data-bs-toggle="tab" data-bs-target="#permission" type="button" role="tab">Permissions</button>
            </li>
        </ul>
        <div class="tab-content container" id="myTabContent">
            <div :class="'tab-pane fade' + (tab == undefined || tab == 'rating' ? ' active show' : '')" id="rating" role="tabpanel" aria-labelledby="rating-tab">
                <Rating :register_time="user.register_time" v-if="user.user_id"></Rating>
            </div>
            <div :class="'mt-4 tab-pane fade' + (tab == 'accepted' ? ' active show' : '')" id="accepted" role="tabpanel" aria-labelledby="accepted-tab">...</div>
            <div :class="'mt-4 tab-pane fade' + (tab == 'blogs' ? ' active show' : '')" id="blogs" role="tabpanel" aria-labelledby="blogs-tab">
                <Table :row="blogRow" :get="getBlog" :pagination="false" v-if="reloadBlog"></Table>
            </div>
            <div :class="'mt-4 tab-pane fade' + (tab == 'permissions' ? ' active show' : '')" id="permission" role="tabpanel" aria-labelledby="permission-tab" v-if="canSeePermission">
                <Table :row="permissionRow" :get="getPermission" :pagination="false"></Table>
            </div>
        </div>
    </div>
</div>
</div></div>
</template>

<script>
import { callAPI, queryUser, tooltipInit, tooltipDispose } from '@/utils'
import { h, nextTick } from 'vue'
import Table from '@/models/Table.vue'
import ClickLike from '@/models/ClickLike.vue'
import { format } from 'silly-datetime'
import UserName from '@/models/UserName.vue'
import Rating from './Rating.vue'

export default {
    inject: ['isAdmin'],
    data() {
        return {
            tab: this.$route.query.tab,
            user: {},
            id: this.$route.params.id,
            canSeePermission: this.isAdmin() || this.$route.params.id == this.$user.user_id,
            reloadBlog: true,
            tooltips: [],
        }
    },
    async mounted() {
        this.tooltips = tooltipInit()
        this.user = await queryUser({user_id: this.id})
    },
    beforeUnmount() {
        tooltipDispose(this.tooltips)
    },
    components: {
        Table,
        ClickLike,
        UserName,
        Rating,
        UserName
    },
    methods: {
        permissionRow(row) {
            if (row == null) return [h('td', {style: "width:60px"}, h('strong', '#ID')),
                h('td', {style: "text-align:left;padding-left:30px!important"}, h('strong', 'Permission Name')),
                h('td', {style: "width: 10%"}, h('strong', 'Users'))]
            else return [h('td', row.permission_id),
                h('td', {style: "text-align:left;padding-left:30px!important"}, h('a', {href: '#/permission/' + row.permission_id}, row.permission_name)),
                h('td', row.count)]
        },
        async getPermission(query) {
            try {
                var id = this.id
                var res = await new Promise(function(res, rej) {
                    callAPI('user_permissions', 'get', {user_id: id}, res, rej)
                })
                return res.data
            } catch (e) {
                alert(e.data._error)
            }
        },
        blogRow(row) {
            if (row == null) return [
                h('td', { style: "text-align: left" }, h('strong', 'Title')),
                h('td', { style: "width:20%" }, h('strong', 'Create date')),
                h('td', { style: "width: 10%; text-align: right" }, h('strong', 'Comments')),
            ]
            else if (row.id < 0) {
                return [
                    h('td', { style: "text-align: left" }, h('a', { href: '#/editblog?local=' + row.local }, [
                        h('span', { style: "color: red" }, '[Draft]'), row.title])),
                    h('td'), h('td', h('a', {onClick: this.deleteDraft(row.local), href: '#'}, 'delete'))
                ]
            } else return [
                h('td', { style: "text-align: left" }, h('a', { href: '#/blog/' + row.blog_id }, [
                    h('span', { style: "color: gray" }, row.private ? '[Private]' : ''), row.title])),
                h('td', {}, format(row.create_time, 'YYYY-MM-DD')),
                h('td', h('div', { class: "row" }, [
                    h(ClickLike, { class: "col px-0", icon: "chatbox-outline", number: row.comments }),
                    h(ClickLike, { class: "col px-0", icon: "thumbs-up-outline", number: row.like, target: { name: "blog", id: row.blog_id }, active: row.liked })
                ]))
            ]
        },
        async getBlog(query) {
            try {
                var id = this.id
                var res = await new Promise(function(res, rej) {
                    callAPI('blogs', 'get', {user_id: id}, res, rej)
                })
                if (res.data.data == null) {
                    res.data.data = []
                }
                if (id == this.$user.user_id) {
                    for (var i = 0; i < localStorage.length; i++) {
                        var key = localStorage.key(i)
                        if (key.endsWith("_title")) {
                            var local = key.substring(0, 16)
                            res.data.data.push({ id: -1, title: localStorage.getItem(local + "_title"), local: local })
                        }
                    }
                }
                res.data.data = res.data.data.reverse()
                return res.data
            } catch (e) {
                console.log(e)
            }
        },
        deleteDraft(local) {
            return (event) => {
                event.preventDefault()
                this.reloadBlog = false
                localStorage.removeItem(local + "_blog_id")
                localStorage.removeItem(local + "_title")
                localStorage.removeItem(local + "_content")
                nextTick(() => { this.reloadBlog = true })
            }
        }
    }
}
</script>

<style>
</style>