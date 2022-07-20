<template>
<div class="mt-4 container" style="">
    <div class="h3 mb-3">User List</div>
    <Table :row="getLine" :sizes="[10, 20, 50, 100]" :get="update" :next="next" :pagination="true" />
</div>
</template>

<script>
import Table from '@/models/Table.vue'
import UserName from '@/models/UserName.vue'
import { callAPI } from '@/utils'
import { h } from 'vue'
export default {
    components: {
        Table,
        UserName,
    },
    methods: {
        getLine(row) {
            if (row == null) return [h('td', {style: "width:60px"}, h('strong', '#ID')),
                h('td', {style: "text-align:left;padding-left:30px!important"}, h('strong', 'Username')), 
                h('td', {}, h('strong', 'Motto')),
                h('td', {style: "width: 10%"}, h('strong', 'Rating'))]
            else return [h('td', row.user_id),
                h('td', {style: "text-align:left;padding-left:30px!important"}, h(UserName, {id: row.user_id, name: row.user_name, rating: row.rating})),
                h('td', row.motto),
                h('td', row.rating)]
        },
        async update(query) {
            var q = { pagesize: query.pagesize }
            if (query.left != undefined) {
                q.left_rating = query.left.rating, q.left_user_id = query.left.user_id
            } else {
                q.right_rating = query.right.rating, q.right_user_id = query.right.user_id
            }
            try {
                var res = await new Promise(function(res, rej) {
                    callAPI('users', 'get', q, res, rej)
                })
                return res.data
            } catch (e) {
                alert(e.data._error)
            }
        },
        next(a, b) {
            if (a == null) {
                if (b < 0) return { rating: 9999, user_id: 0 }
                else return { rating: -9999, user_id: 0 }
            } else {
                a.user_id += b
                return a
            }
        }
    },
}
</script>

<style>
</style>