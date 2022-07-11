<template>
<div class="mt-4 container">
    <div class="modal fade" id="addAnouncement" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Add new announcement</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="container">
                <input class="form-control form-signin-top" placeholder="Blog id" style="font-size:1rem" v-model="blog_id">
                <input class="form-control form-signin-bottom" placeholder="Priority(1~10)" style="font-size:1rem" v-model="priority">
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="addAnouncement">Submit</button>
        </div>
        </div>
    </div>
    </div>
    <div class="card">
        <div class="card-header">
            <div class="row mt-1 mb-1 px-2">
                <div class="mb-0 h5 col">Announcements</div>
                <a class="col" href="#" style="text-align:right;font-size:1.3rem;height:20px" data-bs-toggle="modal" data-bs-target="#addAnouncement" v-if="isAdmin()">
                    <strong><ion-icon name="add" style="--ionicon-stroke-width:50px;color:gray;"></ion-icon></strong>
                </a>
            </div>
        </div>
        <div class="card-body px-0 pb-0">
            <div class="container" v-if="reloadAnnounce">
                <Table :row="getAnnounceRow" :pagination="false" :get="getAnnouncements"></Table>
            </div>
        </div>
    </div>
    
    <div class="card mt-4">
        <div class="card-header">
            <div class="row mt-1 mb-1 px-2">
                <div class="mb-0 h5 col">Top Rating 10</div>
                <a class="col" href="#/users" style="text-align:right;margin-top:2px;">
                    view all
                </a>
            </div>
        </div>
        <div class="card-body px-0 pb-0">
            <div class="container">
                <Table :row="getUserLine" :get="getUsers" :pagination="false"></Table>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Table from '@/models/Table.vue'
import ClickLike from '@/models/ClickLike.vue'
import { callAPI } from '@/utils'
import { h, nextTick } from 'vue'
import { format } from 'silly-datetime'

export default {
    inject: ['isAdmin'],
    data() {
        return { blog_id: "", priority: "", reloadAnnounce: true }
    },
    components: {
        Table,
        ClickLike,
    },
    methods: {
        getAnnounceRow(row) {
            if (row == null) return [
                h('td', { style: "text-align: left" }, h('strong', 'Title')),
                h('td', { style: "width:15%" }, h('strong', 'Release Date')),
                h('td', { style: "width: 10%; text-align: right" }, h('strong', 'Comments')),
                this.isAdmin() ? h('td', { style: "width: 10%;" }, h('strong', 'Priority')) : null
            ]
            else return [
                h('td', { style: "text-align: left" }, h('a', { href: '#/blog/' + row.blog_id }, row.title)),
                h('td', {}, format(row.release_time, 'YYYY-MM-DD')),
                h('td', h('div', { class: "row" }, [
                    h(ClickLike, { class: "col px-0", icon: "chatbox-outline", number: row.comments }),
                    h(ClickLike, { class: "col px-0", icon: "thumbs-up-outline", number: row.like, target: { name: "blog", id: row.blog_id }, active: row.liked })
                ])),
                this.isAdmin() ? h('td', [row.priority + " ", h('a', { href: "#", onClick: this.deleteAnnounce(row.id) }, 'delete')]) : null
            ]
        },
        async getAnnouncements(query) {
            try {
                var res = await new Promise((res, rej) => {
                    callAPI('announcements', 'get', {}, res, rej)
                })
                if (res.data.data != null) {
                    res.data.data.sort((a, b) => { return a.priority != b.priority ? b.priority - a.priority : b.id - a.id })
                }
                return res.data
            } catch (e) {
                alert(e.data._error)
            }
        },
        addAnouncement() {
            callAPI('announcements', 'post', { blog_id: this.blog_id, priority: this.priority }, (res) => {
                this.reloadAnnounce = false
                nextTick(() => { this.reloadAnnounce = true })
            }, (res) => {
                alert(res.data._error)
            })
        },
        deleteAnnounce(id) {
            return function(event) {
                event.preventDefault()
                if (confirm("Do you really want to delete?")) {
                    callAPI('announcements', 'delete', { id: id }, (res) => {
                        this.reloadAnnounce = false
                        nextTick(() => { this.reloadAnnounce = true })
                    }, (res) => {
                        alert(res.data._error)
                    })
                }
            }
        },
        async getUsers(query) {
            query = { pagesize: 10, left_rating: 9999, left_user_id: 0 }
            try {
                var res = await new Promise(function(res, rej) {
                    callAPI('users', 'get', query, res, rej)
                })
                return res.data
            } catch (e) {
                alert(e.data._error)
            }
        },
        getUserLine(row) {
            if (row == null) return [h('td', {style: "text-align:left"}, h('strong', '#ID')),
                h('td', {style: "text-align:left"}, h('strong', 'Username')), 
                h('td', {}, h('strong', 'Motto')),
                h('td', {style: "width: 10%"}, h('strong', 'Rating'))]
            else return [h('td', {style: "text-align:left"}, row.user_id),
                h('td', {style: "text-align:left"}, h('a', {href: '#/user/' + row.user_id}, row.user_name)),
                h('td', row.motto),
                h('td', row.rating)]
        },
    }
}
</script>

<style>
</style>