<template>
  <div class="v-agent-list-item">
    <div class="v-agent-list-item-title">
      <div class="v-agent-list-item-title-left">
        <svg-icon icon-class="agent-avatar" class="icon-class" />
        <span>{{ item.username }}的团队</span>
      </div>
      <div>
        <span
          v-if="!isCurrent && isClick && !isLen"
          class="v-agent-list-item-title-bottom"
          @click.stop="checkNextLevel"
        >查看下级>></span>
        <span
          v-if="isLen"
          class="v-agent-list-item-title-bottom"
          @click.stop="checkBackLevel"
        >{{ backTitle }}</span>
      </div>
    </div>
    <div class="v-agent-list-item-body">
      <div class="v-agent-list-item-body-top" @click.stop="toDetail">
        <div>
          <div>会员总投注</div>
          <div class="count">{{ priceToFixed(item.member_total_bet) }}</div>
        </div>
        <div>
          <div>会员游戏盈亏</div>
          <div class="count">{{ priceToFixed(item.member_game_profit) }}</div>
        </div>
        <div>
          <div>冲正净输赢</div>
          <div class="count">{{ priceToFixed(item.justify_profit) }}</div>
        </div>

        <div class="to-btn">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import toPathHook from '@/hooks/toPath';
import { computed, defineComponent, ref } from 'vue';
import { priceToFixed } from '@/utils/index.js';

export default defineComponent({
  name: 'AgentReportItem',
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          avatar_url: '',
          current_floor: '',
          hierarchy: 0,
          justify_profit: 0,
          member_game_profit: 0,
          member_total_bet: 0,
          username: ''
        };
      }
    },
    isCurrent: {
      type: Boolean,
      default: false
    },
    isLen: {
      type: Boolean,
      default: false
    },
    isAgentName: {
      require: false,
      type: Object
    }
  },
  emits: ['checkNext', 'toDetail', 'checkBack'],
  setup(props, { emit }) {
    const { toPath } = toPathHook();

    const isAgentList: any = ref([])

    const backTitle = ref('<<返回上级')

    const isClick = computed(() => {
      return props.item.hierarchy > 0 && props.item.hierarchy < 3;
    });

    function checkNextLevel() {
      emit('checkNext', props.item.username);
    }

    function toDetail() {
      emit('toDetail');
    }
    function checkBackLevel() {
      emit('checkBack', props.isAgentName);
    }

    return { backTitle, toPath, checkNextLevel, toDetail, isClick, priceToFixed, checkBackLevel, isAgentList };
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
      }
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
