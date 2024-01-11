<template>
  <div class="help-item-box">
    <HelpHeader title="如何充值" :child="true" />
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
        <van-tab title="虚拟币充值" name="1">
          <div class="title" />
          <div class="title">1.什么是虚拟币充值</div>
          <div class="info">
            使用USDT、比特币、以太坊等加密货币进行支付的充值方式。
          </div>
          <div class="title-1">试用虚拟币充值优势：</div>
          <div class="info">
            （1）转账速度快，快速到账无需等待；
          </div>
          <div class="info">
            （2）安全性更高，交易过程全匿名；
          </div>
          <div class="title">2.如何使用虚拟币在小艾竞技充值</div>
          <div class="info">
            <span class="info-b">步骤一：</span>在<span class="info-b">【我的钱包】</span>页面，点击“存款”按钮进行充值。
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
            <span class="info-b">步骤二：</span>在虚拟币充值界面选择好网络协议、输入充值金额后点 击<span
              class="info-b"
            >“立即充值”</span>。
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
          <div class="info">
            <span class="info-b">步骤三：</span>在进入支付信息页界后，记住申请充值的<span
              class="info-b"
            >“充值金额”</span>
            并复制<span class="info-b">“充值地址”</span>。
          </div>
          <van-image class="box-image" width="100%" :src="regImage1[2]">
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
            <span class="info-b">步骤四：</span>确保虚拟币帐号（以欧易钱包举例）有足够的余额进行
            充值，点击“资产”>>选择“资金帐户”>>点击
            <span class="info-b">“提现"</span>
          </div>
          <van-image class="box-image" width="100%" :src="regImage1[3]">
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
            <span class="info-b">步骤五：</span>选择链上提现、选择步骤二中的币种、网络协议、输入
            提币址（即在步骤三中复制的“充值地址”）、输入数量（即在步 骤二中选择的“充值金额”），再点击
            <span class="info-b">“提交”</span>。
          </div>
          <van-image class="box-image" width="100%" :src="regImage1[4]">
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
            <span class="info-b">步骤六：</span>根据提示，输入相应验证码，然后点击<span class="info-b">“确定提现”</span>。
          </div>
          <van-image class="box-image" width="100%" :src="regImage1[5]">
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
        <van-tab title="银行卡充值" name="2">
          <div class="title" />
          <div class="info"><span class="info-b">步骤一：</span>在小艾竞技钱包界面选择人民币充值方式“充值”。</div>
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
            <span class="info-b">步骤二：</span>点击“立即充值”将跳转出对应的收款银行帐号及附言。
            复制帐号及附言信息，在网银转帐时转帐信息需与页面信息一致 即可及时到帐
          </div>
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
    const { pageHeaderDefaultImage } = defaultImages();

    const active = ref('1');

    const route = useRoute();

    const regImage1 = [
      require('@/assets/help/ru-1.png'),
      require('@/assets/help/ru-2.png'),
      require('@/assets/help/ru-1.png'),
      require('@/assets/help/ru-2.png'),
      require('@/assets/help/ru-1.png'),
      require('@/assets/help/ru-2.png')
    ];
    const regImage2 = [require('@/assets/help/rb-1.png')];

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
    .title-1 {
      font-size: 13px;
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
