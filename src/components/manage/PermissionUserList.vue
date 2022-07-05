<template>
<div class="mt-4 container" style="">
    <Table :row="getLine" :get="update" :pagination="false"></Table>
</div>
</template>

<script>
import { callAPI } from '@/utils'
import { h } from 'vue'
import Table from '@/models/Table'
export default {
    beforeCreate() {
        if (this.$route.params.id == 1) {
            this.$router.replace('/users')
            return
        }
    },
    components: {
        Table,
    },
    methods: {
        getLine(row) {
            if (row == null) return [h('td', {style: "width:60px"}, h('strong', '#ID')),
                h('td', {style: "text-align:left;padding-left:30px!important"}, h('strong', 'Username')), 
                h('td', {}, h('strong', 'Motto')),
                h('td', {style: "width: 10%"}, h('strong', 'Rating'))]
            else return [h('td', row.user_id),
                h('td', {style: "text-align:left;padding-left:30px!important"}, h('a', {href: '#/user/' + row.user_id}, row.user_name)),
                h('td', row.motto),
                h('td', row.rating)]
        },
        async update(query) {
            query.permission_id = this.$route.params.id
            try {
                var res = await new Promise(function(res, rej) {
                    callAPI('user_permissions', 'get', query, res, rej)
                })
                return res.data
            } catch (e) {
                alert(e.data._error)
            }
        },
    },
}
</script>