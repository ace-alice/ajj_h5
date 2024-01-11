<template>
  <div class="help-item-box">
    <HelpHeader title="如何提款" :child="true" />
    <!--    v-show="!isDevice"-->
    <!--    :class="{ marginType: isDevice }"-->
    <div class="box-main">
      <van-tabs
        v-model:active="active"
        animated
        color="#07c79c"
        background="#1c2227"
        title-active-color="#fff"
        title-inactive-color="#adbfcf"
        line-width="80"
      >
        <van-tab title="提款到银行卡" name="1">
          <div class="title" />
          <div class="info">
            <span class="info-b">步骤一：</span>在小艾竞技钱包界面选择<span class="info-b">【银行卡取款】</span>
          </div>
          <van-image class="box-image" width="100%" :src="regImage1[0]">
            <template #error>
              <div />
              <!--              <img :src="pageHeaderDefaultImage" style="width:100%" alt="">-->
            </template>
            <template #loading>
              <div />
              <!--              <img :src="pageHeaderDefaultImage" style="width:100%" alt="">-->
            </template>
          </van-image>
          <div class="info">
            <span class="info-b">步骤二：</span>在提款界面选择银行卡、输入提款金额、验证码和交易 密码后点击
            <span class="info-b">【立即提款】</span>，则提款申请提交成功
          </div>
          <van-image class="box-image" width="100%" :src="regImage1[1]">
            <template #error>
              <div />
              <!--              <img :src="pageHeaderDefaultImage" style="width:100%" alt="">-->
            </template>
            <template #loading>
              <div />
              <!--              <img :src="pageHeaderDefaultImage" style="width:100%" alt="">-->
            </template>
          </van-image>
        </van-tab>
        <van-tab title="提款到虚拟币" name="2">
          <div class="title" />
          <div class="info">
            <span class="info-b">步骤一：</span>在小艾竞技钱包界面选择<span class="info-b">【虚拟币取款】</span>
          </div>
          <van-image class="box-image" width="100%" :src="regImage2[0]">
            <template #error>
              <div />
              <!--              <img :src="pageHeaderDefaultImage" style="width:100%" alt="">-->
            </template>
            <template #loading>
              <div />
              <!--              <img :src="pageHeaderDefaultImage" style="width:100%" alt="">-->
            </template>
          </van-image>
          <div class="info">
            <span class="info-b">步骤二：</span>在提款界面选择虚拟币地址、输入提款金额、验证码和 交易密码后点击<span
              class="info-b"
            >【立即提款】</span>，则提款申请提交成功
          </div>
          <van-image class="box-image" width="100%" :src="regImage2[1]">
            <template #error>
              <div />
              <!--              <img :src="pageHeaderDefaultImage" style="width:100%" alt="">-->
            </template>
            <template #loading>
              <div />
              <!--              <img :src="pageHeaderDefaultImage" style="width:100%" alt="">-->
            </template>
          </van-image>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import defaultImages from '@/hooks/defaultImages';
import { computed, defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import HelpHeader from '../Header/index.vue';

export default defineComponent({
  components: { HelpHeader },
  setup(props) {
    const route = useRoute();

    const { pageHeaderDefaultImage } = defaultImages();

    const active = ref(route.query.accountType || '1');

    const regImage1 = [require('@/assets/help/wb-1.png'), require('@/assets/help/wb-2.png')];
    const regImage2 = [require('@/assets/help/wu-1.png'), require('@/assets/help/wu-2.png')];

    const isDevice = computed(() => {
      return route.query.device && route.query.accountType;
    });

    return { pageHeaderDefaultImage, regImage1, active, regImage2, isDevice };
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
  .marginType {
    padding: 10px 15px 10px !important;
  }
}
</style>
