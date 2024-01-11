<template>
  <div class="help-item-box">
    <HelpHeader title="如何参与赛事投注" :child="true" />
    <div class="box-main">
      <div class="title">以小艾电竞举例</div>
      <div class="info">
        <span class="info-b">步骤一：</span>从小艾竞技<span class="info-b">【首页】</span>进入<span
          class="info-b"
        >【小艾电竞】</span>游戏页面
      </div>
      <van-image class="box-image" width="100%" :src="regImage[0]">
        <template #error>
          <div />
        </template>
        <template #loading>
          <div />
        </template>
      </van-image>
      <div class="info">
        <span class="info-b">步骤二：</span>在比赛列表中选择想要投注的赛事，点击投注面板进行
        投注预定后，在下方购物车会出现该投注订单。在投注订单中输 入投注金额，点击<span class="info-b">【立即投注】</span>即可投注成功。（同时可最多选 取15笔注意进行投注）。
      </div>
      <van-image class="box-image" width="100%" :src="regImage[1]">
        <template #error>
          <div />
        </template>
        <template #loading>
          <div />
        </template>
      </van-image>
    </div>
  </div>
</template>

<script lang="ts">
import defaultImages from '@/hooks/defaultImages';
import { defineComponent } from 'vue';
import HelpHeader from '../Header/index.vue';

export default defineComponent({
  components: { HelpHeader },
  setup(props) {
    const { pageHeaderDefaultImage } = defaultImages();

    const regImage = [require('@/assets/help/bet-1.png'), require('@/assets/help/bet-2.png')];

    return { pageHeaderDefaultImage, regImage };
  }
});
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
    .info-b {
      color: #fff;
    }
    .box-image {
      width: calc(100% - 46px) !important;
      margin-left: 23px;
    }
  }
}
</style>
