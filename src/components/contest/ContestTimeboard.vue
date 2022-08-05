<template>
  <div class="card">
    <div class="card-body text-center">
      <div class="text-secondary" v-t="'contest.remaining_time'"></div>
      <h2>
        <Clock v-if="remainingtime > 0" :seconds="remainingtime / 1000" @end="$emit('finish', null)" />
        <span v-else-if="finished" v-t="'contest.ended'"></span>
        <span v-else v-t="'contest.judging'"></span>
      </h2>
      <hr />
      <div class="text-secondary">
        <div>Rule: {{ rule }}</div>
        <div>Max Rating Change: 0</div>
        <div>Status: {{ status }}</div>
      </div>
    </div>
  </div>
  <router-link class="btn btn-secondary mt-3 w-100" :to="`/contest/${id}/participants`">
    Participants</router-link>
  <router-link class="btn btn-info mt-3 w-100" :to="`/submissions/?contest_id=${id}&submitter=${$store.user.user_id}`"
    v-if="$store.user.user_id > 0">My submissions</router-link>
  <button class="btn btn-danger mt-3 w-100" v-if="canedit && !finished" @click="$emit('finalize', null)">End
    Contest</button>
</template>

<script lang="tsx">
import Clock from '@/models/Clock.vue'

export default {
  props: {
    id: null,
    remainingtime: Number,
    rule: null,
    status: null,
    canedit: null,
    finished: null,
  },
  emits: {
    finish: () => true, // contest finish
    finalize: () => true, // manager finalize the contest
  },
  components: {
    Clock,
  },
}
</script>