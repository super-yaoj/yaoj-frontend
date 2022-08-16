<template>
    <div class="mt-4 container" style="">
        <div class="h3 mb-3" v-t="'userlist'"></div>
        <DataTable :dataprovider="UserListData" tableclass="table table-hover table-bt-1" />
    </div>
</template>

<script setup>
import { DataTable } from '@/core'
import { UserListData } from './utils'
</script>