<template>
    <div class="mt-4 container" style="">
        <div class="h3 mb-3">User List</div>
        <DataTable :dataprovider="dataprovider" tableclass="table table-hover ul-table" />
    </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import UserName from '@/models/UserName.vue'
import { callAPI } from '@/utils'

const UserListData = {
    head: [
        { name: 'user_id', title: <strong>#ID</strong>, columnClass: "text-center ul-col-id" },
        { name: 'user_name', title: <strong>Username</strong>, renderer: (user_name, o) => {
            return <UserName id={o.user_id} name={user_name} rating={o.rating} /> }},
        { name: 'motto', title: <strong>Motto</strong>, columnClass: "text-center" },
        { name: 'rating', title: <strong>Rating</strong>, columnClass: "ul-col-rating text-center" },
    ],
    paging: {
        beginKey: { rating: 9999, user_id: 0 },
        endKey: { rating: -9999, user_id: 0 },
        next: key => ({rating: key.rating, user_id: key.user_id + 1}),
        prev: key => ({rating: key.rating, user_id: key.user_id - 1}),
        sizes: [10, 20, 50, 100],
        defaultsize: 10,
    },
    async fetch({ queryKey, queryType, pagesize }) {
        var q = { pagesize }
        if (queryType == 'left') {
            q.left_rating = queryKey.rating;
            q.left_user_id = queryKey.user_id;
        } else {
            q.right_rating = queryKey.rating;
            q.right_user_id = queryKey.user_id;
        }
        try {
            var res = await new Promise(function (res, rej) {
                callAPI('users', 'get', q, res, rej)
            })
            return [res.data.data, res.data.isfull];
        } catch (e) {
            alert(e.data._error)
        }
    },
}

export default {
    components: {
        UserName,
        DataTable,
    },
    data() {
        return {
            dataprovider: UserListData,
        }
    },
}
</script>

<style>
.ul-table {
    border-top: 1px solid rgb(204, 204, 204);
}
.ul-col-id {
    width: 60px
}
.ul-col-rating {
    width: 10px
}
</style>