<template>
  <div class="mt-4 container">
    <div class="row mb-3">
      <div class="col">
        <div class="h3 mb-0">Contest Participants</div>
      </div>
    </div>
    <DataTable :dataprovider="option" />
  </div>
</template>

<script setup lang="tsx">
import { DataTable } from '@/core';
import { noPaging, Option } from '@/core/DataTable';
import UserName from '@/models/UserName.vue';
import { call } from '@/utils/call';
import { useRoute } from 'vue-router';

const route = useRoute()
const option: Option = {
  head: [{
    name: 'user_id', title: '#ID'
  }, {
    name: 'user_name', title: 'Username',
    //  h('td', {style: "text-align:left"}, h(UserName, {id: row.user_id, name: row.user_name, rating: row.rating})),
    renderer: (_, row) => <UserName id={row.user_id} name={row.user_name} rating={row.rating} />,
  }, {
    name: 'rating', title: 'Rating',
  }],
  paging: noPaging(),
  async fetch() {
    let res = await call("/contest_participants", "GET", { param: { contest_id: route.params.id } })
    if (res.data.data != null)
      res.data.data.sort((a, b) => (a.rating == b.rating ? a.user_id - b.user_id : b.rating - a.rating))
    return [res.data.data, res.data.isfull]
  }
}
</script>