<template>
  <div class="mt-4 container-md">
    <div class="row mb-3">
      <div class="h3 mb-0" v-t="'submissions.title'" />
    </div>
    <hr />
    <form class="d-flex mb-3 subm-list-form flex-column flex-lg-row" @submit.prevent="query">
      <div class="input-group flex-nowrap mb-1 me-2">
        <span class="input-group-text" id="basic-addon1" v-t="'submissions.filter.problem'"></span>
        <input type="text" class="form-control" placeholder="Problem ID" v-model="problem_id">
      </div>
      <div class="input-group flex-nowrap mb-1 me-2">
        <span class="input-group-text" id="basic-addon1" v-t="'submissions.filter.contest'"></span>
        <input type="text" class="form-control" placeholder="Contest ID" v-model="contest_id">
      </div>
      <div class="input-group flex-nowrap mb-1 me-2">
        <span class="input-group-text" id="basic-addon1" v-t="'submissions.filter.user'"></span>
        <input type="text" class="form-control" placeholder="User ID" v-model="submitter">
      </div>
      <div class="btn-group col d-flex flex-row mb-1" style="text-align:right" v-if="$store.user.user_id > 0">
        <input type="checkbox" id="onlyme" class="btn-check" v-model="onlyme" style="display: none;">
        <label class="text-nowrap btn btn-outline-warning" for="onlyme" v-t="'submissions.filter.onlyme'"></label>
        <button class="text-nowrap btn btn-primary" type="submit" v-t="'search'"></button>
      </div>
    </form>
    <DataTable :dataprovider="subm_option" ref="submlist" />
  </div>
</template>

<script lang="tsx">
import { DataTable } from "@/core"
import Table from "@/models/Table.vue"
import { callAPI } from '@/utils'
import { subm_table } from "./submission"

export default {
  name: 'SubmissionList',
  components: {
    Table,
    DataTable,
  },
  data() {
    return {
      problem_id: this.$route.query.problem_id || "",
      contest_id: this.$route.query.contest_id || "",
      submitter: this.$route.query.submitter || "",
      onlyme: this.$store.user.user_id > 0 && this.$route.query.submitter == this.$store.user.user_id,
      subm_option: {
        head: subm_table,
        paging: {
          beginKey: { submission_id: 1e9 },
          endKey: { submission_id: 0 },
          next: key => ({ submission_id: key.submission_id - 1 }),
          prev: key => ({ submission_id: key.submission_id + 1 }),
          sizes: [20, 50, 100],
          defaultsize: 20,
        },
        fetch: async ({ queryType, queryKey, pagesize }) => {
          let qry: any = { pagesize }
          if (queryType === 'left') qry.left = queryKey.submission_id
          else qry.right = queryKey.submission_id

          for (var key in this.$route.query)
            qry[key] = this.$route.query[key]

          console.log(qry)

          try {
            var res: any = await new Promise((res, rej) => {
              callAPI('submissions', 'get', qry, res, rej)
            })
            console.log(res.data)
            return [res.data.data, res.data.isfull]
          } catch (e) {
            console.log(e)
          }
        }
      }
    }
  },
  methods: {
    fetchdata() {
      this.$refs.submlist?.driver.fetch()
    },
    query() {
      var q = {
        problem_id: this.problem_id == "" ? undefined : this.problem_id,
        contest_id: this.contest_id == "" ? undefined : this.contest_id,
        submitter: this.submitter == "" ? undefined : this.submitter,
      }
      this.$router.push({ query: q })
    },
  },
  watch: {
    onlyme(to) {
      if (to) {
        this.submitter = this.$store.user.user_id
        this.query()
      } else {
        this.submitter = ""
        this.query()
      }
    }
  },
}
</script>

<style>
</style>