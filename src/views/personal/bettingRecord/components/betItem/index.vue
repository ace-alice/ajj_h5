<template>
  <div class="betting-search-list-col">
    <div class="betting-header">
      <span class="game-venue">{{ detail.game_venue }}</span>
      <span>{{ detail.game_order_time }}</span>
    </div>
    <div class="betting-main">
      <div class="betting-main-clan-1">
        {{ detail.game_name }}
      </div>
      <div class="betting-main-clan-2">
        <div class="van-ellipsis">{{ detail.game_detail }}</div>
        <div class="win-lose">本场{{ +detail.bet_status === 0 ? '负' : (+detail.bet_status === 1 ? '胜' : '平') }}</div>
      </div>
      <div class="betting-main-info">
        <div class="bet">
          <span>投注</span>
          <span>{{ priceToFixed(detail.bet_amount) }}</span>
        </div>
        <div v-if="+detail.game_id !== 5" class="odds">
          <span>赔率</span>
          <span>{{ priceToFixed(detail.bet_odds) }}</span>
        </div>
        <div class="win-loss">
          <span>{{ +detail.bet_status === 0 ? '输' : (+detail.bet_status === 1 ? '赢' : '平') }}</span>
          <span :style="{ color: setColor(Number(detail.bet_winlost)) }">
            {{ Number(detail.bet_winlost) > 0 ? '+' : '' }}
            {{ priceToFixed(detail.bet_winlost) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { priceToFixed } from '@/utils/index.js';

export default defineComponent({
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
  setup() {
    function setColor(num: number) {
      const n = Number(num);
      if (n > 0) {
        return '#ee0a24';
      } else if (n < 0) {
        return '#07c160';
      } else {
        return '#fff';
      }
    }
    return { setColor, priceToFixed };
  }
});
</script>

<style lang="less" scoped>
.betting-search-list-col {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 130px;
  border-radius: 8px;
  background-color: #2d363d;
  margin-bottom: 10px;
  width: 100%;
  overflow: hidden;
  .betting-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    height: 28px;
    line-height: 28px;
    color: #fff;
    font-size: 12px;
    background-color: #3e4a53;
    span:nth-child(1) {
      color: #b6c1cb;
    }
  }
  .betting-main {
    color: #fff;
    position: relative;
    .win-lose {
      //position: absolute;
      right: 15px;
      bottom: 25px;
      font-size: 14px;
      font-weight: bold;
    }
    &-clan-1 {
      padding: 15px 15px 0;
      font-size: 12px;
      font-weight: 600;
      color: #b6c1cb;
    }
    &-clan-2 {
      padding: 15px 15px 8px;
      font-size: 14px;
      font-weight: 300;
      display: flex;
      justify-content: space-between;
      div {
        height: 16px;
      }
      div:nth-child(2) {
        display: flex;
        min-width: 60px;
        justify-content: flex-end;
      }
    }
    &-info {
      display: flex;
      padding: 0 15px;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 300;
      color: #b6c1cb;
      .bet {
        display: flex;
        align-items: center;
        font-weight: bold;
        span:nth-child(2) {
          margin-left: 5px;
          color: #fff;
        }
      }
      .odds {
        display: flex;
        align-items: center;
        font-weight: bold;
        span:nth-child(2) {
          margin-left: 5px;
          color: #fff;
        }
      }
      .win-loss {
        display: flex;
        height: 24px;
        align-items: center;
        font-weight: bold;
        span:nth-child(2) {
          margin-left: 5px;
          color: #fff;
        }
      }
    }
  }
}
</style>
