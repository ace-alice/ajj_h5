<template>
  <div class="help-item-box">
    <HelpHeader title="其他问题" :child="true" />
    <div class="box-main">
      <div class="title">Q：什么是赔率？赔率的高低代表什么？</div>
      <div class="info">
        A：赔率指比赛双方在竞猜结束后的收赔指数，竞猜获胜方获得的额外奖励由赔率决定。
        更被看好、获得更多竞猜投注的一方赔率较低，获胜后支持该方的玩家获得的额外收益较少；
        不被看好、获得更少竞猜投注的一方赔率较高，获胜后玩家获得额外收益较高。通常来讲，
        热门队伍（选手）的支持者更多，获胜几率大，赔率低，获胜后的收益小。
      </div>
      <div class="title">Q：什么是流水？</div>
      <div class="info">
        A：流水只是可以理解为有效投注的总金额，流水可能会影响提款、返水和某些特定活动。
      </div>
      <div class="title">Q：什么是返水？</div>
      <div class="info">
        A：根据会员的有效投注总金额（即流水），来给予一定比例的资金，小艾竞技中各类游戏的返水比例在VIP专题页面中有详细说明。
      </div>
      <div class="title">Q：存款后马上可以提款吗？</div>
      <div class="info">
        A：为了防止洗钱等非法活动，玩家在完成1倍投注后即可提款，例如：存款100元，在投注100元后即可提款。
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelpHeader from '../Header/index.vue'

export default defineComponent({
  components: { HelpHeader },
  setup(props) {
    return {}
  }
})
</script>

<style lang="less" scoped>
.help-item-box {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  .box-main {
    width: calc(100% - 30px);
    padding: 48px 15px 10px;
    div {
      & + div {
        margin-top: 15px;
      }
    }
    .title {
      font-size: 14px;
      font-weight: bold;
      color: #fff;
    }
    .info {
      font-size: 12px;
      color: #adbfcf;
    }
    .box-image {
      width: calc(100% - 46px) !important;
      margin-left: 23px;
    }
  }
}
</style>
