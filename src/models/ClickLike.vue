<template>
  <div :style="selfstyle" @click="onClickLike">
    <ion-icon :name="icon" style="vertical-align: middle; font-size: 1rem; margin-right: 2px" />
    <span style="vertical-align: middle">{{ num }}</span>
  </div>
</template>

<script>
import { callAPI } from "@/utils";

export default {
  props: ["icon", "number", "active", "target"],
  data() {
    return {
      current: false,
    };
  },
  methods: {
    onClickLike() {
      if (!this.target) return;
      callAPI("likes", "post",
        { target: this.target.name, id: this.target.id },
        (res) => {
          this.current = !this.current;
        },
        (res) => {
          alert(res.data._error);
        }
      );
    },
  },
  computed: {
    num() {
      if (this.active) return this.number + (this.current ? -1 : 0);
      return this.number + (this.current ? 1 : 0);
    },
    selfstyle() {
      return {
        cursor: this.target && 'pointer' || undefined,
        color: this.current ^ this.active && '#F70' || undefined,
        userSelect: 'none',
      }
    },
  },
};
</script>