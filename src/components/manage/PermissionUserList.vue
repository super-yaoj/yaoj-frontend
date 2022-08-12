<template>
  <div class="mt-4 container-md">
    <DataTable :dataprovider="option" />
  </div>
</template>

<script>
import DataTable, { noPaging } from '@/core/DataTable'

import { callAPI } from '@/utils'
import { UserListTable } from '../user/utils'

export default {
  data() {
    return {
      option: {
        head: UserListTable,
        paging: noPaging(1000),
        fetch: async () => {
          try {
            var res = await new Promise((res, rej) => {
              callAPI('permission_users', 'get', {
                permission_id: this.$route.params.id
              }, res, rej)
            })
            return [res.data.data, res.data.isfull]
          } catch (e) {
            alert(e)
          }
        },
      }
    }
  },
  components: {
    DataTable,
  },
}
</script>