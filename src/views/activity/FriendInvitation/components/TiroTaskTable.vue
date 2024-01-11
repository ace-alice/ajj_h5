<template>
  <div class="tiro-task-table">
    <div class="table-header">
      <div>被邀请人累计充值需求</div>
      <div>赠送金额</div>
    </div>
    <div v-for="(content, index) in info" :key="index" class="table-body" :class="{ 'has-back': index % 2 === 1 }">
      <div>{{ content.total_deposit }}</div>
      <div>{{ content.amount }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TiroTaskTable',
  props: {
    info: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    return {};
  }
});
</script>

<style lang="less" scoped>
.tiro-task-table {
  overflow: hidden;
  border-bottom: 1px #2d363d solid;
  > div {
    display: flex;
    justify-content: space-between;
    > div {
      height: 40px;
      line-height: 40px;
      text-align: center;
      &:nth-child(1) {
        width: 60%;
      }
      &:nth-child(2) {
        width: 40%;
      }
    }
  }
  .table-header {
    background-color: #3e4a53;
    border-radius: 8px;
    > div {
      color: #fff;
      font-size: 14px;
    }
  }
  .table-body {
    border-radius: 8px;
    > div {
      color: #c2cdd5;
      font-size: 13px;
    }
  }
  .has-back {
    background-color: #2d363d;
  }
}
</style>
