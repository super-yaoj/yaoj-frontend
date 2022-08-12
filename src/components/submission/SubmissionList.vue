<template>
  <div class="mt-4 container-md">
    <div class="row mb-3">
      <div class="h3 mb-0" v-t="'submissions.title'" />
    </div>
    <hr />
    <form class="row mb-3 subm-list-form flex-column flex-lg-row" @submit.prevent="query">
      <div class="input-group col flex-nowrap mb-1">
        <span class="input-group-text" id="basic-addon1" v-t="'submissions.filter.problem'" />
        <input type="text" class="form-control" placeholder="Problem id" v-model="problem_id">
      </div>
      <div class="input-group col flex-nowrap mb-1">
        <span class="input-group-text" id="basic-addon1" v-t="'submissions.filter.contest'" />
        <input type="text" class="form-control" placeholder="Contest id" v-model="contest_id">
      </div>
      <div class="input-group col flex-nowrap mb-1">
        <span class="input-group-text" id="basic-addon1" v-t="'submissions.filter.user'" />
        <input type="text" class="form-control" placeholder="User id" v-model="submitter">
      </div>
      <div class="btn-group col d-flex flex-row mb-1" style="text-align:right" v-if="$store.user.user_id > 0">
        <input type="checkbox" id="onlyme" class="btn-check" v-model="onlyme" style="display: none;">
        <label class="btn btn-outline-warning" for="onlyme" v-t="'submissions.filter.onlyme'" />
        <button class="btn btn-primary" type="submit" v-t="'search'" />
      </div>
    </form>
    <DataTable :dataprovider="subm_option" ref="submlist" />
  </div>
</template>

<script lang="tsx">
import DataTable from "../DataTable"
import Table from "@/models/Table.vue"
import { callAPI } from '@/utils'
import { subm_table } from "./submission"

export default {
  name: 'SubmissionList',
  components: {
    Table,
    DataTable,
  },
  created() {
    console.log('created')
  },
  updated() {
    console.log('updated')
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
      console.log('trigger')
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