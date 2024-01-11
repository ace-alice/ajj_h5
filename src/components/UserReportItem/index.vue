<template>
  <div class="v-agent-list-item">
    <div class="v-agent-list-item-title">
      <div class="v-agent-list-item-title-left">
        <svg-icon icon-class="agent-avatar" class="icon-class" />
        <span>{{ item.username }}</span>
      </div>
      <div>
        <van-icon v-show="!isCurrent" name="arrow" class="van-icon-arrow" @click.stop="toChangeUser" />
      </div>
    </div>
    <div class="v-agent-list-item-body">
      <div class="v-agent-list-item-body-top" @click.stop="toDetail">
        <div>
          <div>投注</div>
          <div class="count">{{ item.total_bet || item.all_total_bet }}</div>
        </div>
        <div>
          <div>游戏盈亏</div>
          <div class="count">{{ item.game_profit }}</div>
        </div>
        <div>
          <div>总盈亏</div>
          <div class="count">{{ item.total_profit }}</div>
        </div>
        <div v-if="item.username !== '所有人统计'" class="to-btn">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UserReportItem',
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          username: '所有人统计',
          all_total_bet: 0,
          game_profit: 0,
          total_profit: 0
        };
      }
    },
    isCurrent: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toChangeUser', 'toDetail'],
  setup(props, { emit }) {
    function toChangeUser() {
      emit('toChangeUser', props.item.username);
    }

    function toDetail() {
      if (props.item.username === '所有人统计') return
      emit('toDetail');
    }
    return { toChangeUser, toDetail };
  }
});
</script>

<style lang="less" scoped>
.icon-class {
  font-size: 16px;
  font-weight: bold;
  margin: 0 15px;
}
.v-agent-list-item {
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  width: 100%;
  + .v-agent-list-item {
    margin-top: 10px;
  }
  .v-agent-list-item-title {
    height: 40px;
    width: 100%;
    background-color: #45515b;
    display: flex;
    align-items: center;
    color: #fff;
    justify-content: space-between;

    .v-agent-list-item-title-bottom {
      font-size: 12px;
      margin-right: 15px;
      background-image: linear-gradient(to right, #12dedf, #07c79c), linear-gradient(to bottom, #bbc6cf, #bbc6cf);
      font-family: PingFang-SC;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .v-agent-list-item-title-left {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 14px;
      .van-icon-user {
        font-size: 24px;
        margin: 0 15px;
      }
    }
    .van-icon-arrow {
      font-size: 16px;
      margin: 0 15px;
      color: #94a5b1;
    }
  }
  .v-agent-list-item-body {
    height: 55px;
    width: 100%;
    flex-shrink: 0;
    background-color: #2d363d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #bbc6cf;
    flex-wrap: wrap;
    div {
      flex-shrink: 0;
    }
    .v-agent-list-item-body-top {
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      padding-right: 20px;
      position: relative;
      > div {
        width: 30%;
        text-align: center;
        div {
          margin: 5px auto;
        }
      }
      .count {
        font-weight: bold;
        color: #fff;
      }
      .to-btn {
        position: absolute;
        width: 20px;
        right: 10px;
        top: 15px;
      }
    }
  }
}
</style>
