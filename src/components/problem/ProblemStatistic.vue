<template>
  <h3 class="text-center mt-4">{{ 'Problem #' + id + ': Statistics' }}</h3>
  <ul class="nav nav-tabs mt-3">
    <li class="nav-item">
      <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#ac" :value="id">AC
        Submissions</button>
    </li>
    <li class="nav-item">
      <a class="nav-link" :href="'#/submissions?problem_id=' + id" :value="id">All Submissions</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" :href="'#/problem/' + id" :value="id">Back</a>
    </li>
  </ul>
  <div class="tab-content mt-4 container">
    <div class="row">
      <div class="col">
        <div class="progress" style="height:100%" v-tooltip:bottom :title="acnum + ' AC / ' + totnum + ' Total'">
          <div class="progress-bar bg-success" role="progressbar" :style="'width:' + acratio + '%;min-width:20px'">{{
              acratio
          }}%</div>
        </div>
      </div>
      <div class="col">
        <select class="form-select" @change="change" v-model="mode">
          <option value="time" selected>Minimal Time</option>
          <option value="memory">Minimal Memory</option>
          <option value="length">Shortest Code</option>
        </select>
      </div>
    </div>
    <div class="tab-pane fade show active mt-3" id="ac">
      <DataTable :dataprovider="subm_option" />
    </div>
  </div>
</template>

<script lang="tsx">
import Table from '@/models/Table.vue'
import { callAPI } from '@/utils';
import { nextTick } from 'vue';
import { subm_table } from '../submission/submission';
import DataTable, { Option } from '../DataTable';

export default {
  data() {
    return {
      id: this.$route.params.id,
      acnum: 0,
      totnum: 0,
      refresh: true,
      mode: "time",
      subm_option: {
        head: subm_table,
        paging: {
          beginKey: { value: 0, id: 0 },
          endKey: { value: 1e9, id: 1e9 },
          next: key => ({ ...key, id: key.id + 1 }),
          prev: key => ({ ...key, id: key.id - 1 }),
          sizes: [20, 50, 100],
          defaultsize: 20,
        },
        fetch: async ({ queryType, queryKey, pagesize }) => {
          var data: any = {
            problem_id: this.id,
            mode: this.mode,
            pagesize: pagesize,
          }
          if (queryType === 'left') {
            data.left = queryKey.value
            data.left_id = queryKey.id
          } else {
            data.right = queryKey.value
            data.right_id = queryKey.id
          }
          try {
            var res: any = await new Promise((res, rej) => {
              callAPI('problem_statistic', 'get', data, res, rej)
            })
            this.acnum = res.data.acnum
            this.totnum = res.data.totnum
            console.log(res)
            return [res.data.data, res.data.isfull]
          } catch (e) {
            console.log(e)
          }
        }
      } as Option<{ value: number; id: number }>
    };
  },
  components: {
    Table,
    DataTable,
  },
  methods: {
    change() {
      this.refresh = false
      nextTick(() => this.refresh = true)
    },
  },
  computed: {
    acratio() {
      return this.totnum == 0 ? 0 : Math.round(this.acnum / this.totnum * 100)
    },
  },
}
</script>