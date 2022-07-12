<template>
<div class="modal fade" :id="'add_' + name" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Add {{title}}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" />
        </div>
        <div class="modal-body">
            <input class="form-control" :placeholder="name + ' id'" v-model="add_id">
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="add">Submit</button>
        </div>
        </div>
    </div>
</div>
<Table :pagination="false" :get="getData" :row="getRow" v-if="reload" />
</template>

<script>
import ClickLike from '@/models/ClickLike.vue'
import Table from '@/models/Table.vue'
import { callAPI } from '@/utils'
import qs from 'qs'
import { h, nextTick } from 'vue'

export default {
    props: ['url', 'data_name', 'title', 'name', 'no-modify', 'query'],
    data() {
        return {
            id: this.$route.params.id,
            reload: true,
            add_id: "",
            _query: this.query == undefined ? "" : "?" + qs.stringify(this.query)
        }
    },
    components: {
        ClickLike,
        Table,
    },
    methods: {
        getRow(row) {
            if (row == null) return [
                h('td', { style: "text-align:left;width:10%" }, h('strong', '#ID')),
                h('td', { style: "text-align:left" }, h('strong', this.title + ' Name')),
                this.noModify ? null : h('td', { style: "text-align:right" }, h('a',
                    { href: "#", "data-bs-toggle": "modal", "data-bs-target": "#add_" + this.name },
                    h('ion-icon', { name: "add-outline", style: "font-size: 1.2rem; vertical-align: text-bottom; color: gray; --ionicon-stroke-width: 40px;" })
                )),
            ]
            return [
                h('td', { style: "text-align:left" }, row[this.data_name[1]]),
                h('td', { style: "text-align:left" }, h('a', { href: "#/" + this.name + "/" + row[this.data_name[1]] + this._query }, row[this.data_name[2]])),
                this.noModify ? null : h('td', { style: "text-align:right" }, h('a',
                    { href: "#", onClick: this.delete(row[this.data_name[1]]) },
                    h('ion-icon', { name: "remove-outline", style: "font-size: 1.2rem; vertical-align: text-bottom; color: gray; --ionicon-stroke-width: 40px;" })
                )),
            ]
        },
        async getData(query) {
            try {
                var data = {}
                data[this.data_name[0]] = this.id
                var res = await new Promise((res, rej) => {
                    callAPI(this.url, 'get', data, res, rej)
                })
                if (res.data.data != null) {
                    res.data.data.sort((a, b) => a[this.data_name[1]] - b[this.data_name[1]])
                }
                return res.data
            } catch(e) {
                alert(e.data._error)
            }
        },
        delete(id) {
            return (event) => {
                event.preventDefault()
                var data = {}
                data[this.data_name[0]] = this.id
                data[this.data_name[1]] = id
                callAPI(this.url, 'delete', data, (res) => {
                    this.reload = false
                    nextTick(() => { this.reload = true })
                }, (res) => {
                    alert(res.data._error)
                })
            }
        },
        add() {
            var data = {}
            data[this.data_name[0]] = this.id
            data[this.data_name[1]] = this.add_id
            callAPI(this.url, 'post', data, (res) => {
                this.reload = false
                nextTick(() => { this.reload = true })
            }, (res) => {
                alert(res.data._error)
            })
        },
    }
}
</script>