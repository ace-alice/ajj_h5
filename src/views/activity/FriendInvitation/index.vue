<template>
  <div class="tiro-task">
    <div class="tiro-task-box">
      <van-image width="100%" :src="friendInvitationImg">
        <template #error>
          <img :src="pageHeaderDefaultImage" style="width:100%" alt="">
        </template>
        <template #loading>
          <ImageLoadBox />
        </template>
      </van-image>
      <div class="tiro-task-info">
        <div>邀请注册人数：{{ activeStatus.count }}</div>
        <div>邀请获得奖励：{{ activeStatus.amount }}</div>
      </div>
      <div id="qrCode" class="qr-code">
        <vue-qr :text="qrUrl" :size="80" :margin="4" />
      </div>
      <div class="tiro-task-button-group">
        <div @click.stop="copyInfo(1)">复制分享链接</div>
        <div @click.stop="copyInfo(2)">保存分享二维码</div>
        <div @click.stop="showPopupPrice">活动记录</div>
      </div>
      <div class="get-button" @click.stop="showPopupPrice">立即领取</div>
      <div class="tiro-task-time" style="margin: 14px 0 0;">
        活动时间：
        <span v-if="+activityInfo.is_time_limit === 1">
          {{ parseTime(activityInfo.start_time, '{y}/{m}/{d}') }} -
          {{ parseTime(activityInfo.end_time, '{y}/{m}/{d}') }}
        </span>
        <span v-else>长期活动</span>
      </div>
      <div class="tiro-task-time">
        活动内容
      </div>
      <TiroTaskTable :info="contentLists" />
      <div class="tiro-task-time">
        活动规则
      </div>
      <div class="rule-box-item">
        1.每位使用推广链接邀请注册并存款的会员，将获得推荐好友奖金，最高可获得{{ maxPrice }}元活动奖金。
      </div>
      <div class="rule-box-item">
        2.您邀请成功的会员绑定银行卡并成功充值后可在活动页面领取奖金，完成一倍有效流水即可提款
      </div>
      <div class="rule-box-item">
        3.电竞赔率：＜1.5，体育赔率：香港盘＜0.75、欧洲盘＜1.75以、马来盘＜0.75、印尼盘＜-1.3以、美国盘＜-133，串关、走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）
      </div>
      <div class="rule-box-item">
        4.邀请人与被邀请人必须为不同身份的真实玩家，邀请人VIP等级需大于等于1级，每一手机号码、银行卡、电脑、IP地址都会判定为同一玩家。
      </div>
      <div class="rule-box-item">
        5.凡使用作弊手段，恶意套取奖金者，我们将保留无限期审核扣回红利及所产生的利润权利，严重者将冻结所有关联账号。
      </div>
      <div class="rule-box-item">
        6. 凡参加活动用户，即表示接受且自愿遵守平台规定，平台保留最终解释权。
      </div>
    </div>
    <van-action-sheet v-model:show="showPopup" title="活动记录" :style="{ height: '80%', color: '#fff' }">
      <div class="form-box">
        <div class="list-total-info">
          <span>我推荐的人数：{{ activeStatus.count }}</span><span>累计获得奖励：{{ activeStatus.amount }}</span><span />
        </div>
        <TimeSelect @timeChange="formChange" />
      </div>
      <van-pull-refresh v-model="loading.refresh" @refresh="onRefresh">
        <van-list v-model:loading="loading.onload" :finished="loading.finished" @load="onLoad">
          <template #finished>
            <span v-if="priceList.length > 0" style="margin-bottom:20px">
              没有更多了~
            </span>
            <NoData v-else />
          </template>
          <!--          <MyPriceListItem v-for="(price, index) in priceList" :key="index" :price="price" />-->
          <PriceListCom :info="priceList" @resetStatus="getStatus" />
        </van-list>
      </van-pull-refresh>
    </van-action-sheet>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, onMounted, reactive } from 'vue';
import defaultImages from '@/hooks/defaultImages';
import { Toast } from 'vant';
import useClipboard from 'vue-clipboard3';
import vueQr from 'vue-qr/src/packages/vue-qr.vue';
import qrDownloadToImageHook from '@/hooks/qrDownloadToImage';
import activityPageHook from '@/hooks/activityPage';
import priceListHook from './Hooks/priceListHook';
import NoData from '@/components/noData/index.vue';
import TiroTaskTable from './components/TiroTaskTable.vue';
import { parseTime } from '@/utils/index.js';
import TimeSelect from './components/TimeSelect.vue';
import PriceListCom from './components/PriceListCom.vue';
import ImageLoadBox from '@/components/ImageLoadBox/index.vue';

export default defineComponent({
  name: 'FriendInvitation',
  components: { vueQr, NoData, TiroTaskTable, TimeSelect, PriceListCom, ImageLoadBox },
  setup() {
    const { pageHeaderDefaultImage } = defaultImages();

    const { toClipboard } = useClipboard();

    const { saveCode } = qrDownloadToImageHook();

    const friendInvitationImg = require('@/assets/activity/friendInvitation.png');

    const { activityInfo, request, token, tokenObject, device } = activityPageHook();

    const { loading, priceList, onRefresh, onLoad, formChange } = priceListHook();

    const inviteId = computed(() => {
      return tokenObject.value.data?.member_id || '';
    });

    const qrUrl = computed(() => {
      if (inviteId.value) {
        return `${location.origin}/#/register?invite_id=${inviteId.value}`;
      } else {
        return `${location.origin}/#/home`;
      }
    });

    const contentLists = computed(() => {
      if (activityInfo.activity_template_content) {
        return JSON.parse(activityInfo.activity_template_content).config_arr || [];
      } else {
        return [];
      }
    });

    const maxPrice = computed(() => {
      let result: number = 0;
      contentLists.value.forEach((content: any) => {
        result += Number(content.amount) || 0;
      });
      return result;
    });

    async function copyInfo(tag: number) {
      if (!inviteId.value) return Toast('请登录后进行操作！');
      switch (tag) {
        case 1:
          try {
            await toClipboard(qrUrl.value);
            Toast.success({
              message: '复制成功',
              duration: 1500
            });
          } catch (e) {
            // console.log(e)
          }
          return;
        case 2:
          try {
            saveCode('qrCode', 'qrCode', device.value, qrUrl.value);
            // Toast.success({
            //   message: '保存成功',
            //   duration: 1500
            // });
          } catch (e) {
            // console.log(e)
          }
          return;
      }
    }

    const activeStatus = reactive({ count: 0, amount: 0 });

    function getStatus() {
      if (!token.value) return;
      request
        .value({
          url: '/index/Activity/inviteFriendStatus',
          method: 'get'
        })
        .then((res: any) => {
          if (+res.code === 1) {
            Object.assign(activeStatus, res.data);
          } else {
            activeStatus.count = 0;
            activeStatus.amount = 0;
          }
        })
        .catch(() => {
          activeStatus.count = 0;
          activeStatus.amount = 0;
        });
    }

    const showPopup = ref(false);

    async function showPopupPrice() {
      if (!token.value) return Toast('请登录后进行操作！');
      showPopup.value = true;
      await getStatus();
      onRefresh();
    }

    onMounted(() => {
      nextTick(() => {
        getStatus();
      });
    });

    return {
      pageHeaderDefaultImage,
      contentLists,
      friendInvitationImg,
      copyInfo,
      activityInfo,
      showPopupPrice,
      loading,
      priceList,
      onRefresh,
      onLoad,
      showPopup,
      parseTime,
      qrUrl,
      formChange,
      getStatus,
      activeStatus,
      maxPrice
    };
  }
});
</script>

<style lang="less" scoped>
.qr-code {
  padding: 16px 0;
  text-align: center;
}
.form-box {
  position: absolute;
  top: 45px;
  left: 0;
  width: 100%;
  z-index: 2009;
  background-color: #1c2227;
}
:deep(.van-action-sheet__content) {
  padding-top: 70px;
}
.list-total-info {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 30px);
  margin: auto;
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
      font-family: PingFang-SC, serif;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
    }
    .tiro-task-content {
      margin: 0 0 14px;
      font-family: PingFang-SC, serif;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
    }
  }

  .rule-box-item {
    font-family: PingFang-SC, serif;
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
    margin: 10px 0 0;
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
      font-family: PingFang-SC, serif;
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
