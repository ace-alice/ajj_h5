<template>
  <div class="search-list-col" :class="{ 'has-back': index % 2 == 0 }">
    <div>
      <div>{{ item.title_cn }}</div>
      <div>{{ item.create_time }}</div>
    </div>
    <div>
      <div>{{ priceStatus }}{{ item.amount }}</div>
      <div>余额：{{ item.available_balance }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'TradeRecord',
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const priceStatus = computed(() => {
      return props.item.order_isadd ? '+' : '-'
    })

    return { priceStatus }
  }
})
</script>

<style lang="less" scoped>
.search-list-col {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 66px;
  border-radius: 4px;
  width: 100%;
  color: #b6c1cb;
  font-family: PingFang-SC;
  font-size: 12px;
  > div {
    width: calc(50% - 15px);
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &:nth-child(1) {
      div:nth-child(1) {
        font-size: 14px;
      }
      div:nth-child(2) {
        color: #94a5b1;
      }
    }
    &:nth-child(2) {
      align-items: flex-end;
      div:nth-child(1) {
        color: #fff;
        font-weight: 600;
      }
      div:nth-child(2) {
        font-size: 11px;
      }
    }
  }
}
.has-back {
  background-color: #2d363d;
}
</style>
