<template>
    <div class="mt-4 container" style="">
        <div class="h3 mb-3">User List</div>
        <DataTable :dataprovider="dataprovider" tableclass="table table-hover table-bt-1" />
    </div>
</template>

<script>
import { DataTable } from '@/core'
import { UserListData } from './utils'

export default {
    components: {
        DataTable,
    },
    data() {
        return {
            dataprovider: UserListData,
        }
    },
}
</script>