<template>
  <div class="tiro-task">
    <div class="tiro-task-box">
      <van-image width="100%" :src="headerImg">
        <template #error>
          <img :src="pageHeaderDefaultImage" style="width:100%;height:100%" alt="">
        </template>
        <template #loading>
          <ImageLoadBox />
        </template>
      </van-image>
      <div class="tiro-task-time" style="margin: 14px 0 0;">
        活动时间：
        <span v-if="+activityInfo.is_time_limit === 1">
          {{ parseTime(activityInfo.start_time, '{y}/{m}/{d}') }} -
          {{ parseTime(activityInfo.end_time, '{y}/{m}/{d}') }}
        </span>
        <span v-else>长期活动</span>
      </div>
      <div class="tiro-task-button-group" :style="{ '--width': 100 / buttonGroup.length - 2 + '%' }">
        <div
          v-for="button in buttonGroup"
          :key="button.code"
          :class="{ 'button-active': componentCode === button.code }"
          @click.stop="changeButton(button.code)"
        >
          {{ button.title }}
        </div>
      </div>
      <transition-group name="van-fade">
        <BindBank v-if="componentCode === 'bind-bank'" key="bind-bank" :activity-info="activityInfo" />
        <GameExperience
          v-if="componentCode === 'game-experience'"
          key="game-experience"
          :activity-info="activityInfo"
        />
        <SignInPackage v-if="componentCode === 'sign-in-package'" key="sign-in-package" :activity-info="activityInfo" />
      </transition-group>
      <div class="tiro-task-time">
        活动规则
      </div>
      <div class="rule-box-item">
        1.新手任务完成后需在活动页面领取任务奖金。
      </div>
      <div class="rule-box-item">
        2.新手任务奖金需完成{{
          activityInfo.shuffle_rate
        }}倍流水后即可提款，活动及所获奖金不可与其它充值、返水活动共享。
      </div>
      <div class="rule-box-item">
        3.此活动只针对新注册会员有效，活动期间只能享受一次，注册日起7日内未完成视为自动放弃本次活动。
      </div>
      <div class="rule-box-item">
        4.会员首次提款前需在平台完成一次最低金额充值。
      </div>
      <div class="rule-box-item">
        5.每位有效会员、手机号码、电子邮箱、银行卡、IP地址、每台设备只能享有一次活动，对违规的会员，保留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
      </div>
      <div class="rule-box-item">
        6.凡参加活动会员，即表示接受且自愿遵守平台规定，平台保留最终解释权。
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import defaultImages from '@/hooks/defaultImages';
import BindBank from './components/BindBank.vue';
import GameExperience from './components/GameExperience.vue';
import SignInPackage from './components/SignInPackage.vue';
import webViewBridgeHook from '@/hooks/webViewBridge';
import { parseTime } from '@/utils/index.js';
import activityPageHook from '@/hooks/activityPage';
import ImageLoadBox from '@/components/ImageLoadBox/index.vue';

export default defineComponent({
  name: 'TiroTask',
  components: { BindBank, GameExperience, SignInPackage, ImageLoadBox },
  setup() {
    const { routeGo } = webViewBridgeHook();

    function toPath(name: string) {
      routeGo(name);
    }

    const { pageHeaderDefaultImage } = defaultImages();

    const headerImg = require('@/assets/activity/sign-in.png');

    // const buttonGroup = [
    //   { label: '绑定银行卡', code: 'bind-bank' },
    //   { label: '游戏体验', code: 'game-experience' },
    //   { label: '签到礼包', code: 'sign-in-package' }
    // ];

    const componentCode = ref('');

    function changeButton(code: string) {
      if (componentCode.value === code) return;
      componentCode.value = code;
    }

    const { activityInfo } = activityPageHook();

    const buttonGroup = computed(() => {
      const result: any[] = [];
      if (activityInfo?.activity_template_content) {
        const temp = JSON.parse(activityInfo?.activity_template_content);
        if (temp.bind_card && temp.bind_card.is_open) {
          result.push(Object.assign(temp.bind_card, { code: 'bind-bank' }));
          if (!componentCode.value) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            componentCode.value = 'bind-bank';
          }
        }
        if (temp.game && temp.game.is_open) {
          result.push(Object.assign(temp.game, { code: 'game-experience' }));
          if (!componentCode.value) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            componentCode.value = 'game-experience';
          }
        }
        if (temp.sign && temp.sign.is_open) {
          result.push(Object.assign(temp.sign, { code: 'sign-in-package' }));
          if (!componentCode.value) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            componentCode.value = 'game-experience';
          }
        }
      }
      return result;
    });

    return {
      pageHeaderDefaultImage,
      buttonGroup,
      componentCode,
      changeButton,
      toPath,
      headerImg,
      parseTime,
      activityInfo
    };
  }
});
</script>

<style lang="less" scoped>
.tiro-task {
  width: 100%;

  .tiro-task-box {
    height: 100%;
    margin: auto;
    width: calc(100% - 30px);
    overflow: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    > div {
      flex-shrink: 0;
      width: 100%;
    }
    .tiro-task-time {
      margin: 15px 0;
      font-family: PingFang-SC, serif;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
    }
    .tiro-task-button-group {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      > div {
        width: var(--width);
        flex-shrink: 0;
        height: 38px;
        border-radius: 8px;
        background-color: #3e4a53;
        color: #c2cdd5;
        border: solid 1px #3e4a53;
        font-family: PingFang-SC, serif;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        line-height: 38px;
        cursor: pointer;
      }
      .button-active {
        border: solid 1px #0ed6c7;
        color: #fff;
      }
    }
    .rule-box-item {
      font-family: PingFang-SC, serif;
      font-size: 13px;
      margin: 5px 0;
      color: #c2d2df;
    }
  }
}
</style>
