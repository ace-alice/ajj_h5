<template>
  <div class="betting-search-list-summary">
    <div class="pen-count">
      <span>笔数：</span>
      <span>{{ data.total_bet }}</span>
    </div>
    <div class="bet-amount">
      <span>投注金额：</span>
      <span>{{ data.total_amount }}</span>
    </div>
    <div class="total-win-loss">
      <span>总盈亏：</span>
      <span :style="{ color: setColor(Number(data.total_winlose)) }">{{
        data.total_winlose
      }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TotalDetail',
  props: {
    data: {
      type: Object,
      default: () => {
        return { total_amount: 0, total_bet: 0, total_winlose: 0 }
      }
    }
  },
  setup() {
    function setColor(num: number) {
      const n = Number(num)
      if (n > 0) {
        return '#07c160'
      } else if (n < 0) {
        return '#ee0a24'
      } else {
        return '#fff'
      }
    }

    return { setColor }
  }
})
</script>

<style lang="less" scoped>
.betting-search-list-summary {
  display: flex;
  height: 40px;
  align-items: center;
  .pen-count {
    font-size: 12px;
    color: #b6c1cb;
    span:nth-child(2) {
      color: #fff;
    }
  }
  .bet-amount {
    font-size: 12px;
    color: #b6c1cb;
    margin-left: 15px;
    span:nth-child(2) {
      color: #fff;
    }
  }
  .total-win-loss {
    font-size: 12px;
    color: #b6c1cb;
    margin-left: 15px;
  }
}
</style>
