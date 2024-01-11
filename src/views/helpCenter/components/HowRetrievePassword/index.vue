<template>
  <div class="help-item-box">
    <HelpHeader title="如何找回密码" :child="true" />
    <div class="box-main">
      <div class="title">
        如果忘记登录密码不用担心，可使用自助方式来找回密 码。
      </div>
      <div class="info">
        <span class="info-b">找回密码</span>登录小艾竞技APP，选择线路，进入登录界面，选择账号密码登 录。
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
        点击忘记密码，计入找回密码界面，在该界面出入账号、新密码 确认密码、验证码，点击
        <span class="info-b">【提交】</span>按钮。
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
        温馨提示:无果无法正常找回密码，可以申请人工服务。点击任意 界面的<span class="info-b">【客服】</span>图标即可联系在线客服。
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
      require('@/assets/help/pass-1.png'),
      require('@/assets/help/pass-2.png'),
      require('@/assets/help/pass-3.png')
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
