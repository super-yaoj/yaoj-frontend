<template>
  <DataTableEditable tableclass="table table-hover table-bt-1" :dataprovider="prob_provider" @create="onCreateProb"
    @delete="onDeleteProb" ref="probtable" />
  <CardModal :display="onSubmitCreateProb != null" class="modal-shadow" @close="() => onSubmitCreateProb = null">
    <template #header="ctxt">
      <h5 class="modal-title">Add Problem</h5>
      <button type="button" class="btn-close" @click="ctxt.close"></button>
    </template>
    <template #body>
      <div class="input-group mb-3">
        <span class="input-group-text">Problem ID</span>
        <input type="text" class="form-control" v-model="add_pid" @keyup.enter="onSubmitCreateProb" />
      </div>
    </template>
    <template #footer="ctxt">
      <button type="button" class="btn btn-secondary" @click="ctxt.close">Close</button>
      <button type="button" class="btn btn-primary" @click="onSubmitCreateProb">Save
        changes</button>
    </template>
  </CardModal>
</template>

<script lang="tsx">
import DataTableEditable from '../../core/DataTableEditable'
import { CardModal } from '@/core'

import { RouterLink } from 'vue-router'
import { callAPI } from '@/utils'
import { noPaging, Option } from '@/core/DataTable'

export default {
  props: {
    id: null, // contest id
  },
  components: {
    DataTableEditable,
    CardModal,
  },
  updated() {
    console.log('on updated')
    this.$refs.probtable.fetch()
  },
  data() {
    return {
      onSubmitCreateProb: null,
      add_pid: "",
      prob_provider: {
        head: [{
          name: 'problem_id',
          title: <strong>#ID</strong>,
          columnClass: "w-10",
        }, {
          name: 'title',
          title: <strong>Problem</strong>,
          renderer: (title, o) => <RouterLink to={`/problem/${o.problem_id}?contest_id=${this.id}`}>
            {title}
          </RouterLink>,
        }],
        fetch: async () => {
          let q = { contest_id: this.id }
          console.log(q)
          let res: any = await new Promise((res, rej) => {
            callAPI('contest_problems', 'get', q, res, rej)
          })
          if (res.data.data != null) {
            res.data.data.sort((a, b) => a.problem_id - b.problem_id)
          } else res.data.data = []
          return [res.data.data, false]
        },
        paging: noPaging(),
      } as Option,
    }
  },
  methods: {
    onCreateProb({ next }) {
      console.log("create!")
      this.onSubmitCreateProb = () => {
        console.log("submit", this.add_pid);
        callAPI('contest_problems', 'post', {
          contest_id: this.id,
          problem_id: this.add_pid
        }, () => {
          this.onSubmitCreateProb = null;
          this.add_pid = "";
          next()
        }, (res: any) => {
          alert(res.data._error)
        })
      }
    },
    onDeleteProb({ data, next }) {
      var q = { contest_id: this.id, problem_id: data.problem_id }
      callAPI('contest_problems', 'delete', q, (res) => {
        next();
      }, (res) => {
        alert(res.data._error)
      })
    },
  },
}
</script>