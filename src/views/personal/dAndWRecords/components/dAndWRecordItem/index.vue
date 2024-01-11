<template>
  <div
    v-if="type === 'deposit'"
    class="search-list-col"
    :class="{ 'has-back': index % 2 === 0 }"
  >
    <div>
      <div>{{ item.cash_type_name }}</div>
      <div>{{ item.create_time }}</div>
    </div>
    <div>
      <div
        :class="{ 'is-cancel': +item.order_status_client === 3 }"
      >{{ priceStatus }}{{ item.recharge_amount }}</div>
      <div :style="{ color: setStatus(Number(item.order_status_client))[1] }">
        {{ setStatus(Number(item.order_status_client))[0] }}
      </div>
    </div>
  </div>
  <div v-else class="search-list-col" :class="{ 'has-back': index % 2 === 0 }">
    <div>
      <div>{{ item.money_change_name }}</div>
      <div>{{ item.create_time }}</div>
    </div>
    <div>
      <div
        :class="{ 'is-cancel': +item.order_status_client === 3 }"
      >{{ priceStatus }}{{ item.draw_amount }}</div>
      <div
        :style="{ color: setStatus(Number(item.draw_status_client))[1] }"
      >
        {{ setStatus(Number(item.draw_status_client))[0] }}
      </div>
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
      default: () => {
      }
    },
    type: {
      type: String,
      default: 'deposit'
    },
    index: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const priceStatus = computed(() => {
      return props.type === 'deposit' ? '+' : '-'
    })

    function setStatus(status: number) {
      switch (status) {
        case 1:
          return ['成功', '#3ce20f']

        case 3:
          return ['已取消', '#e81b1b']

        case 4:
          return ['待处理', '#999']
        default:
          return ['未知', '#999']
      }
    }

    return { priceStatus, setStatus }
  }
})
</script>

<style lang="less" scoped>
.is-cancel {
  text-decoration: line-through;
}

.search-list-col {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 66px;
  border-radius: 4px;
  width: 100%;
  color: #b6c1cb;
  font-family: PingFang-SC,serif;
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
