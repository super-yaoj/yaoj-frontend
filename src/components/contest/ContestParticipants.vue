<template>
<div class="mt-4 container">
    <div class="row mb-3">
        <div class="col">
            <div class="h3 mb-0">Contest Participants</div>
        </div>
    </div>
    <Table :row="getLine" :get="getParticipants" :pagination="false"></Table>
</div>
</template>

<script>
import Table from '@/models/Table.vue'
import { callAPI } from '@/utils'
import { h } from 'vue'

export default {
    components: {
        Table,
    },
    methods: {
        getLine(row) {
            if (row == null) return [h('td', {style: "text-align:left; width: 10%"}, h('strong', '#ID')),
                h('td', {style: "text-align:left"}, h('strong', 'Username')), 
                h('td', {style: "width: 10%"}, h('strong', 'Rating'))]
            else return [h('td', {style: "text-align:left"}, row.user_id),
                h('td', {style: "text-align:left"}, h('a', {href: '#/user/' + row.user_id}, row.user_name)),
                h('td', row.rating)]
        },
        async getParticipants(query) {
            try {
                var res = await new Promise((res, rej) => {
                    callAPI('contest_participants', 'get', { contest_id: this.$route.params.id }, res, rej)
                })
                if (res.data.data != null)
                    res.data.data.sort((a, b) => (a.rating == b.rating ? a.user_id - b.user_id : b.rating - a.rating))
                return res.data
            } catch (e) {
                console.log(e.data._error)
            }
        },
        
    },
}
</script>