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
  <div class="d-grid gap-2 mt-2">
    <router-link class="btn btn-secondary" :to="`/contest/${id}/participants`" v-t="'contest.participants'">
    </router-link>
    <router-link class="btn btn-info" :to="`/submissions/?contest_id=${id}&submitter=${$store.user.user_id}`"
      v-if="$store.user.user_id > 0" v-t="'contest.my_submissions'"></router-link>
    <button class="btn btn-danger" v-if="canedit && !finished" @click="$emit('finalize', null)"
      v-t="'contest.finalize'"></button>
  </div>
</template>

<script lang="tsx">
import Clock from './Clock.vue'

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