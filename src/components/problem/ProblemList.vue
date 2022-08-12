<template>
    <div class="mt-4 container-md">
        <div class="row mb-3">
            <div class="col">
                <div class="h3 mb-0" v-t="'problems.title'" />
            </div>
            <div class="col" style="text-align:right;" v-if="isAdmin()">
                <button class="btn btn-sm btn-primary" @click="addProblem" v-t="'problems.new'" />
                <div class="text-success small" v-if="success > 0">
                    Successfully added, problem id: {{ success }}.
                </div>
            </div>
        </div>
        <DataTable tableclass="table table-hover pl-table" :dataprovider="provider" ref="problist" />
    </div>
</template>

<script lang="tsx">
import DataTable, { Option } from '@/components/DataTable'
import ClickLike from '@/models/ClickLike.vue'
import { callAPI } from '@/utils'

const ProbListProvider: Option<{ problem_id: number }> = {
    // head: 提供表头，每一列的标题、对应的data字段名和渲染函数以及附加的css class
    head: [{
        name: 'problem_id', title: <strong>#ID</strong>, columnClass: "pl-col-id text-center"
    }, {
        name: 'title', title: <strong>Problem</strong>, renderer: (title, o) =>
            <router-link to={"/problem/" + o.problem_id}>{title}</router-link>
    }, {
        name: 'like', title: <strong>Comments</strong>, columnClass: "pl-col-comment text-center", renderer: (_, o) =>
            // @ts-ignore
            <ClickLike icon="thumbs-up-outline" number={o.like}
                target={{ name: "problem", id: o.problem_id }} active={o.liked} />
    }],
    // 提供分页信息
    // 用 display 控制是否显示分页，默认为 true
    paging: {
        beginKey: { problem_id: 0 },
        endKey: { problem_id: 1000000 },
        next: key => ({ problem_id: key.problem_id + 1 }),
        prev: key => ({ problem_id: key.problem_id - 1 }),
        sizes: [20, 50, 100],
        defaultsize: 20,
    },
    async fetch({ queryKey, queryType, pagesize }) {
        console.log(queryKey)
        let q: any = { pagesize }
        if (queryType == 'left') {
            q.left = queryKey.problem_id
        } else {
            q.right = queryKey.problem_id
        }
        console.log('fetch query: ', q)
        try {
            let res: any = await new Promise((res, rej) => {
                callAPI('problems', 'get', q, res, rej)
            })
            // console.log(res.data)
            return [res.data.data, res.data.isfull];
        } catch (e) {
            alert(e.data._error)
        }
    },
}

export default {
    name: "ProblemList",
    inject: ['isAdmin'],
    data() {
        return {
            success: 0,
            provider: ProbListProvider,
        }
    },
    components: {
        ClickLike,
        DataTable,
    },
    methods: {
        fetchdata() {
            if (this.$refs.problist) this.$refs.problist.driver.fetch()
        },
        addProblem() {
            callAPI('problem', 'post', {}, (res) => {
                this.success = res.data.id
                setTimeout(() => { this.success = 0 }, 1000)
                this.fetchdata()
            }, (res) => {
                alert(res.data._error)
            })
        },
    }
}
</script>

<style>
.pl-col-id {
    width: 60px
}

.pl-col-comment {
    width: 10%
}

.pl-table {
    border-top: 1px solid rgb(204, 204, 204);
}
</style>