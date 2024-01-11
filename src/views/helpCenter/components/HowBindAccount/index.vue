<template>
  <div class="help-item-box">
    <HelpHeader title="如何绑定虚拟币账户" :child="true" />
    <div class="box-main">
      <div class="info">
        <span class="info-b">步骤一：</span>打开并登录欧易APP，选择<span class="info-b">【资产】</span>-<span
          class="info-b"
        >【资金帐户】</span>
        点击充值
      </div>
      <van-image class="box-image" width="100%" :src="regImage[0]">
        <template #error>
          <div />
        </template>
        <template #loading>
          <div />
        </template>
      </van-image>
      <div class="info"><span class="info-b">步骤二：</span>选择或搜索您想要绑定的虚拟币币种，点击进入</div>
      <van-image class="box-image" width="100%" :src="regImage[1]">
        <template #error>
          <div />
        </template>
        <template #loading>
          <div />
        </template>
      </van-image>
      <div class="info">
        <span class="info-b">步骤三：</span>点击<span class="info-b">【复制地址】</span>。注：该地址为新链地址，对拥有多
        个链名称的币种，如果需要绑定旧链地址需要到Web端或者APP 进行选择查看复制地址
      </div>
      <van-image class="box-image" width="100%" :src="regImage[2]">
        <template #error>
          <div />
        </template>
        <template #loading>
          <div />
        </template>
      </van-image>
      <div class="info">
        <span class="info-b">步骤四：</span>回到小艾竞技，点击页面中的<span class="info-b">【添加虚拟币帐户】</span>
      </div>
      <van-image class="box-image" width="100%" :src="regImage[3]">
        <template #error>
          <div />
        </template>
        <template #loading>
          <div />
        </template>
      </van-image>
      <div class="info">
        <span class="info-b">步骤五：</span>选择您要绑定的虚拟币币种（包含链名称），再将刚复 制的地址粘贴在<span
          class="info-b"
        >【虚拟币地址】</span>中，最后输入验证码，点击<span class="info-b">【下 一步】</span>
      </div>
      <van-image class="box-image" width="100%" :src="regImage[4]">
        <template #error>
          <div />
        </template>
        <template #loading>
          <div />
        </template>
      </van-image>
      <div class="info">
        <span class="info-b">步骤六：</span>确认绑定信息无误后，点击<span class="info-b">【确认提交】</span>即可完成绑定
      </div>
      <van-image class="box-image" width="100%" :src="regImage[5]">
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

    const regImage = [
      require('@/assets/help/bind-1.png'),
      require('@/assets/help/bind-2.png'),
      require('@/assets/help/bind-3.png'),
      require('@/assets/help/bind-4.png'),
      require('@/assets/help/bind-5.png'),
      require('@/assets/help/bind-6.png')
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
