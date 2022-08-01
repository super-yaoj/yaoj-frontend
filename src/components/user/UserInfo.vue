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
    <div class="small" style="color:gray;word-wrap:break-word">{{user.motto}}</div>
    <router-link 
        v-if="user.user_id == $store.user.user_id"
        class="mt-2 mb-2 btn btn-sm btn-outline-secondary w-100" 
        role="button" :to="'/user/' + user.user_id + '/modify/'"
    >Modify Information</router-link>
    <ul class="list-group list-group-flush" style="word-wrap:break-word">
        <user-info-meta title="User ID" icon="id-card">ID #{{user.user_id}}</user-info-meta>
        <user-info-meta title="Rating" icon="bar-chart"> 
            <UserName 
                style="display: inline-block;" :id="user.user_id" 
                :name="user.rating + ''" :rating="user.rating"
            />
        </user-info-meta>
        <user-info-meta title="User Group" icon="people">{{user.user_group}}</user-info-meta>
        <user-info-meta title="Register Time" icon="time">{{ user.register_time }}</user-info-meta>
        <user-info-meta v-if="user.email != ''" title="Email" icon="mail">{{user.email}}</user-info-meta>
        <user-info-meta v-if="user.organization != ''" title="Organization" icon="briefcase">{{user.organization}}</user-info-meta>
    </ul>
</div>
<div class="col-12 col-sm-7 col-lg-8">
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
        <div :class="'tab-pane fade' + (tab == undefined || tab == 'rating' ? ' active show' : '')" id="rating" role="tabpanel">
            <Rating :register_time="user.register_time" v-if="user.user_id" />
        </div>
        <div :class="'mt-4 tab-pane fade' + (tab == 'accepted' ? ' active show' : '')" id="accepted" role="tabpanel">...</div>
        <div :class="'mt-4 tab-pane fade' + (tab == 'blogs' ? ' active show' : '')" id="blogs" role="tabpanel">
            <Table :timestamp="timestamp" :row="blogRow" :get="getBlog" :pagination="false" />
        </div>
        <div :class="'mt-4 tab-pane fade' + (tab == 'permissions' ? ' active show' : '')" id="permission" role="tabpanel" v-if="canSeePermission">
            <Table :timestamp="timestamp" :row="permissionRow" :get="getPermission" :pagination="false" />
        </div>
    </div>
</div>
</div>
</template>

<script>
import { resolveDirective, withDirectives } from 'vue'
import { callAPI, queryUser } from '@/utils'
import { h, nextTick } from 'vue'
import Table from '@/models/Table.vue'
import ClickLike from '@/models/ClickLike.vue'
import { format } from 'silly-datetime'
import UserName from '@/models/UserName.vue'
import Rating from './Rating.vue'

const UserInfoMeta = ({ title, icon }, context) => {
    const tooltip = resolveDirective('tooltip')
    return withDirectives(<li class="list-group-item info-item" title={title}>
        <ion-icon name={icon} class="feather me-2" />
        {context.slots.default()}
    </li>, [
    [tooltip, undefined, 'left', null]
  ])
}

export default {
    name: "UserInfo",
    inject: ['isAdmin'],
    data() {
        return {
            tab: this.$route.query.tab,
            user: {},
            id: this.$route.params.id,
            canSeePermission: this.isAdmin() || this.$route.params.id == this.$store.user.user_id,
            timestamp: 0,
        }
    },
    components: {
        Table,
        ClickLike,
        UserName,
        UserInfoMeta,
        Rating,
        UserName
    },
    methods: {
        fetchdata(route) {
            queryUser({user_id: route.params.id}).then(data => {
                this.user = data
            })
            console.log("fetch", route)
            this.tab = route.query.tab
            this.id = route.params.id
            this.timestamp = new Date().getTime()
        },
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
                <td style="text-align: left"><strong>Title</strong></td>,
                <td style="width: 20%"><strong>Create Date</strong></td>,
                <td style="width: 10%; text-align: right"><strong>Comments</strong></td>,
            ]
            else if (row.id < 0) {
                return [
                    <td style="text-align: left">
                        <router-link to={'/editblog?local=' + row.local}>
                            <span style="color: red">[Draft] </span>
                            {row.title}
                        </router-link>
                    </td>,
                    <td></td>,
                    <td><a onClick={this.deleteDraft(row.local)} href="#">delete</a></td>
                ]
            } else return [
                <td style="text-align: left">
                    <router-link to={'/blog/' + row.blog_id}>
                        {row.private ? <span style="color: gray">[Private] </span> : null}
                        {row.title}
                    </router-link>
                </td>,
                <td>{format(row.create_time, "YYYY-MM-DD")}</td>,
                <td>
                    <div class="d-flex justify-content-between">
                    <ClickLike icon="chatbox-outline" number={row.comments}/>
                    <ClickLike 
                        icon="thumbs-up-outline" number={row.like} 
                        target={{name: "blog", id: row.blog_id}}
                        active={row.liked}
                    />
                    </div>
                </td>
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
                if (id == this.$store.user.user_id) {
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
                // this.reloadBlog = false
                localStorage.removeItem(local + "_blog_id")
                localStorage.removeItem(local + "_title")
                localStorage.removeItem(local + "_content")
                // nextTick(() => { this.reloadBlog = true })
                this.timestamp = new Date().getTime()
            }
        }
    }
}
</script>

<style>
</style>