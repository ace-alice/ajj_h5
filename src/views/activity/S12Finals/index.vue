<template>
  <div class="tiro-task">
    <GlobalLoading v-show="infoLoading" min-height="400px" align-row="flex-start" top="50%" />
    <div class="tiro-task-box">
      <van-image width="100%" :src="friendInvitationImg">
        <template #error>
          <img :src="pageHeaderDefaultImage" style="width:100%" alt="" />
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
      <div class="tiro-task-time">
        活动内容：
      </div>
      <div class="tiro-task-table">
        <div class="table-header">
          <div v-for="item in getTemplate.result_arr[0]" :key="item">{{ item }}</div>
        </div>
        <div
          class="table-body"
          :class="{ 'has-back': index % 2 === 1 }"
          v-for="(item, index) in getTemplate.result_arr.slice(1)"
          :key="index"
        >
          <div v-for="child in item" :key="child">{{ child }}</div>
        </div>
      </div>
      <div class="activity-info">每1场赛事仅限申请1次对应奖励，每日最多可申请3次战力奖金</div>
      <div class="list-button" :class="{ 'is-click': hasToken }" @click.stop="venuePayDialog = true">
        <!-- <van-loading v-show="canSubmit" type="spinner" size="18px" /> -->
        <span>立即领取</span>
      </div>
      <div class="tiro-task-time">
        活动规则
      </div>
      <div v-for="(rule, index) in rules" :key="index" class="rule-box-item">
        {{ rule }}
      </div>
      <div class="tiro-task-dialog">
        <van-dialog v-model:show="venuePayDialog" :show-confirm-button="false" :show-cancel-button="false">
          <BonusApplication @close="venuePayDialog = false"></BonusApplication>
        </van-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue';
import defaultImages from '@/hooks/defaultImages';
import GlobalLoading from '@/components/Loading/index.vue';
import { Toast } from 'vant';
import activityPageHook from '@/hooks/activityPage';
import { parseTime } from '@/utils/index.js';
import ImageLoadBox from '@/components/ImageLoadBox/index.vue';
import { getToken } from '@/utils/index.js';
import BonusApplication from './components/BonusApplication.vue';

export default defineComponent({
  name: 'FirstCharge',
  components: { GlobalLoading, ImageLoadBox, BonusApplication },
  setup() {
    const venuePayDialog = ref(false);

    const { pageHeaderDefaultImage } = defaultImages();

    const { infoLoading, activityInfo, request, setActivityId } = activityPageHook();

    const friendInvitationImg = require('@/assets/activity/s12-finals-header.png');
    const rules = ref([
      '1.活动盘口仅限小艾电竞，投注赛事仅限S12赛事为有效投注。',

      '2.赛事投注仅限独赢，让球，大小，单双四个盘口，允许投注上半场或全场及滚球，投注赛事赔率不得低于＜1.5。',

      '3.此活动不可与其它充值活动共享，领取奖金需完成一倍有效流水即可提款。',

      '4.电竞赔率：＜1.5，体育赔率：香港盘＜0.75以下、欧洲盘＜1.75以下、马来盘＜0.75以下、印尼盘＜-1.3以下、美国盘＜-133以下，串关、走盘（滚球），注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）',

      '5.每位有效会员、手机号码、电子邮箱、银行卡、IP地址、每台设备仅限一个账户享受此活动，对违规的用户，保留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。',

      '6.凡参加活动会员，即表示接受且自愿遵守平台规定，平台保留最终解释权。'
    ]);

    // const tableList = [
    //   {
    //     label: '≥888元',
    //     value: '8元'
    //   },
    //   {
    //     label: '≥1888元',
    //     value: '18元'
    //   },
    //   {
    //     label: '≥2888元',
    //     value: '28元'
    //   },
    //   {
    //     label: '≥3888元',
    //     value: '38元'
    //   },
    //   {
    //     label: '≥5888元',
    //     value: '88元'
    //   }
    // ];

    const hasToken = ref(false);

    function toGetPrice() {
      request
        .value({
          url: '/index/Activity/memberFirstRechargeApply',
          method: 'get'
        })
        .then((res: any) => {
          // eslint-disable-next-line eqeqeq
          if (res.code == 1) {
            Toast.success(`奖金领取成功！`);
          } else {
            Toast(res.msg || res.message);
          }
        });
    }
    const getTemplate = computed(() => {
      if (activityInfo.activity_template_content) {
        const _temp = JSON.parse(activityInfo.activity_template_content) || { tabel_column: 2, config_arr: [] };
        _temp.result_arr = [];
        _temp.config_arr &&
          _temp.config_arr.map((item: any) => {
            const obj: any = {};
            Object.keys(item)
              .slice(0, _temp.tabel_column)
              .map((key: any) => {
                obj[key] = item[key];
              });
            _temp.result_arr.push(obj);
          });
        return _temp;
      } else {
        return {
          tabel_column: 2,
          result_arr: [],
          config_arr: []
        };
      }
    });

    onMounted(() => {
      nextTick(() => {
        hasToken.value = getToken() ? true : false;
        setActivityId(18);
      });
    });

    return {
      pageHeaderDefaultImage,
      rules,
      friendInvitationImg,
      toGetPrice,
      infoLoading,
      hasToken,
      activityInfo,
      parseTime,
      venuePayDialog,
      getTemplate
    };
  }
});
</script>
<style lang="less" scoped>
:deep(.van-image) {
  border-radius: 10px;
  overflow: hidden;
}
.activity-info {
  text-align: left;
  color: #fff;
  font-size: 14px;
  margin: 10px 0;
}
.list-button {
  height: 40px;
  border-radius: 8px;
  background-color: #808080;
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
  cursor: not-allowed;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    margin-left: 10px;
  }
}

.is-click {
  background-image: linear-gradient(to right, #12dedf, #07c79c);
  color: #130e0e;
  cursor: pointer;

  &:hover {
    box-shadow: 20px 20px 40px #11dcd9 inset;
  }

  &:active {
    box-shadow: 20px 20px 40px #235f5e inset;
  }
}

.tiro-task {
  .tiro-task-info {
    width: calc(100% - 2px) !important;
    height: 40px;
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    border: solid 1px #6e7e8b;
    align-items: center;
    border-radius: 8px;
    margin-top: 10px;

    > div {
      padding: 0 15px;
    }
  }

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
      margin: 14px 0;
      font-family: PingFang-SC;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
    }

    .tiro-task-content {
      margin: 0 0 14px;
      font-family: PingFang-SC;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
    }
  }

  .tiro-task-table {
    overflow: hidden;
    border-bottom: 1px #2d363d solid;
    border-radius: 8px;

    > div {
      display: flex;
      justify-content: space-between;

      > div {
        width: 33%;
        height: 40px;
        line-height: 40px;
        text-align: center;
      }
    }

    .table-header {
      background-color: #3e4a53;
      border-radius: 8px;
      font-weight: bold;

      > div {
        color: #fff;
        font-size: 14px;
      }
    }

    .table-body {
      border-radius: 8px;

      > div {
        color: #c2cdd5;
        font-size: 13px;
      }
    }

    .has-back {
      background-color: #2d363d;
    }
  }

  .rule-box-item {
    font-family: PingFang-SC;
    font-size: 13px;
    margin: 5px 0;
    color: #c2d2df;
  }

  .get-button {
    background-image: linear-gradient(to right, #12dedf, #07c79c);
    height: 40px;
    border-radius: 8px;
    color: #130e0e;
    line-height: 40px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    margin: 10px 0 20px;
  }

  .tiro-task-button-group {
    display: flex;
    justify-content: space-between;

    > div {
      width: 31%;
      flex-shrink: 0;
      height: 32px;
      border-radius: 17px;
      color: #fff;
      font-family: PingFang-SC;
      font-size: 12px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      border: 1px #11dcd9 solid;
    }
  }

  .qr-image {
    margin: 16px auto;
  }
}
</style>
