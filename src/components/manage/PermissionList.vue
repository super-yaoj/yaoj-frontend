<template>
<div class="mt-4 container-md">
    <div class="h3 mb-3">Permission List</div>
    <Table :row="getLine" :sizes="sizes" :get="update" :next="next" :pagination="true"></Table>
</div>
</template>

<script>
import Table from '@/models/Table.vue'
import { callAPI } from '@/utils'
import { h } from 'vue'
export default {
    data() {
        return { sizes: [10, 20, 50, 100] }
    },
    components: {
        Table,
    },
    methods: {
        getLine(row) {
            if (row == null) return [h('td', {style: "width:60px"}, h('strong', '#ID')),
                h('td', {style: "text-align:left;padding-left:30px!important"}, h('strong', 'Permission Name')),
                h('td', {style: "width: 10%"}, h('strong', 'Users'))]
            else return [h('td', row.permission_id),
                h('td', {style: "text-align:left;padding-left:30px!important"}, h('a', {href: '#/permission/' + row.permission_id}, row.permission_name)),
                h('td', row.count)]
        },
        async update(query) {
            try {
                var res = await new Promise(function(res, rej) {
                    callAPI('permissions', 'get', query, res, rej)
                })
                return res.data
            } catch (e) {
                alert(e.data._error)
            }
        },
        next(a, b) {
            if (a == null) {
                if (b < 0) return 0
                else return 1 << 30
            } else {
                return a.permission_id + b
            }
        }
    },
}
</script>

<style>
</style>