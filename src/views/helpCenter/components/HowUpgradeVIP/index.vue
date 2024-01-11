<template>
  <div class="help-item-box">
    <HelpHeader title="如何提升VIP等级" :child="true" />
    <div class="box-main">
      <div class="title">小艾竞技用户账号如何升级</div>
      <div class="info">
        小艾竞技的VIP等级可以使帐号获得更多增值服务。 用户登录帐号后，可进入<span class="info-b">【个人中心】</span>查看VIP等级相关信息。
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
        用户初始为VIP0，等级越高VIP福利越多， 帐号等级晋级和保级所需流水、存款及经验值明细，具体如下：
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

    const regImage = [require('@/assets/help/vip-1.png'), require('@/assets/help/vip-2.png')];

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
