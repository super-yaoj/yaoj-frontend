<template>
  <div class="mt-4 container-md">
    <div class="h3 mb-3">Permission List</div>
    <DataTable :dataprovider="permlist_option" tableclass="table table-hover table-bt-1" />
  </div>
</template>

<script lang="tsx">
import DataTable, { Option }  from '@/core/DataTable'

import { callAPI } from '@/utils'
import { RouterLink } from 'vue-router'

const permlist_option = {
  head: [{
    title: <strong>#ID</strong>, name: 'permission_id',
    style: 'width: 60px',
    columnClass: 'text-center',
  }, {
    title: <strong>Title</strong>, name: 'permission_name',
    renderer: (title, o) => <RouterLink to={`/permission/${o.permission_id}`}>{title}</RouterLink>,
  }, {
    title: <strong>Users</strong>, name: 'count',
  }],
  paging: {
    beginKey: { permission_id: 0 },
    endKey: { permission_id: 1e9 },
    prev: num => ({ permission_id: num.permission_id - 1}),
    next: num => ({ permission_id: num.permission_id + 1}),
    sizes: [20, 50, 100],
    defaultsize: 20,
  },
  async fetch(ctxt) {
    let qry: any = { pagesize: ctxt.pagesize }
    if (ctxt.queryType === 'left') {
      qry.left = ctxt.queryKey.permission_id
    } else {
      qry.right = ctxt.queryKey.permission_id
    }

    console.log('qry', qry)
    try {
      var res: any = await new Promise((res, rej) => {
        callAPI('permissions', 'get', qry, res, rej)
      })
      console.log(res.data)
      return [res.data.data, res.data.isfull]
    } catch (e) {
      alert(e.data._error)
    }
  },
} as Option<{ permission_id: number }>;

export default {
  data() {
    return {
      permlist_option,
    }
  },
  components: {
    DataTable,
  },
}
</script>

<style>
</style>