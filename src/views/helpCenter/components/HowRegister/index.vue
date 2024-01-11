<template>
  <div class="help-item-box">
    <HelpHeader title="如何注册" :child="true" />
    <div class="box-main">
      <div class="title">账户注册流程</div>
      <div class="info">
        登录小艾竞技APP，选择线路进入首页，在首页或个人中心进行 点击登录
      </div>
      <van-image class="box-image" width="100%" :src="regImage[0]">
        <template #error>
          <div />
          <!--          <img :src="pageHeaderDefaultImage" style="width:100%" alt="" />-->
        </template>
        <template #loading>
          <div />
          <!--          <img :src="pageHeaderDefaultImage" style="width:100%" alt="" />-->
        </template>
      </van-image>
      <div class="info">
        登录小艾竞技APP，选择线路进入首页，在首页或个人中心进行 点击登录
      </div>
      <van-image class="box-image" width="100%" :src="regImage[1]">
        <template #error>
          <div />
          <!--          <img :src="pageHeaderDefaultImage" style="width:100%" alt="">-->
        </template>
        <template #loading>
          <div />
          <!--          <img :src="pageHeaderDefaultImage" style="width:100%" alt="">-->
        </template>
      </van-image>
      <div class="info">
        登录小艾竞技APP，选择线路进入首页，在首页或个人中心进行 点击登录
      </div>
      <van-image class="box-image" width="100%" :src="regImage[2]">
        <template #error>
          <div />
          <!--          <img :src="pageHeaderDefaultImage" style="width:100%" alt="">-->
        </template>
        <template #loading>
          <div />
          <!--          <img :src="pageHeaderDefaultImage" style="width:100%" alt="">-->
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

    const regImage = [
      require('@/assets/help/reg-1.png'),
      require('@/assets/help/reg-2.png'),
      require('@/assets/help/reg-3.png')
    ];

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
    .box-image {
      width: calc(100% - 46px) !important;
      margin-left: 23px;
    }
  }
}
</style>
