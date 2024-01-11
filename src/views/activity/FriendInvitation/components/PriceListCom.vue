<template>
  <div ref="table" class="tiro-task-table" :style="{ '--display': isShow ? '' : 'none' }" @scroll="scroll">
    <div ref="tableHeader" class="table-header">
      <div>序号</div>
      <div>被邀请人</div>
      <div>操作</div>
      <div>奖励领取状态</div>
      <div>奖励金额</div>
      <div>累计存款金额</div>
      <div>注册时间</div>
    </div>
    <div v-for="(content, index) in info" :key="index" class="table-body" :class="{ 'has-back': index % 2 === 1 }">
      <div>{{ index + 1 }}</div>
      <div>{{ content.invitees_name }}</div>
      <div>
        <div class="get-button" :class="{ 'is-allow': +content.status === 2 }" @click.stop="toGetPrice(content)">
          {{ +content.status === 3 ? '已领取' : '领取' }}
        </div>
      </div>
      <div>{{ setStatus(+content.status) }}</div>
      <div>{{ content.invite_amount }}</div>
      <div>{{ content.deposit_amount }}</div>
      <!--      <div>{{ content.register_time ? parseTime(Number(String(content.register_time).padEnd(13, '0'))) : '' }}</div>-->
      <div>{{ content.register_time }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue';
import { Toast } from 'vant';
import activityPageHook from '@/hooks/activityPage';
import { parseTime } from '@/utils/index.js';

export default defineComponent({
  name: 'PriceListCom',
  props: {
    info: {
      type: Array,
      default: () => []
    }
  },
  emits: ['resetStatus'],
  setup(props, { emit }) {
    const inviteStatus = [
      { label: '未达标', value: 1 },
      { label: '待领取', value: 2 },
      { label: '已领取', value: 3 },
      { label: '已过期', value: 4 }
    ];
    function setStatus(status: number) {
      const temp = inviteStatus.filter((item: any) => {
        return status === item.value;
      });
      if (temp.length > 0) {
        return temp[0].label;
      } else {
        return '';
      }
    }

    const { request, token } = activityPageHook(false);

    const receiveLoading = ref(false);

    function toGetPrice(content: any) {
      if (!token.value) return;
      if (receiveLoading.value) return;
      if (content.status !== 2) return;
      receiveLoading.value = true;
      request
        .value({
          url: '/index/Activity/inviteAwardReceive',
          method: 'post',
          data: { id: content.id }
        })
        .then((res: any) => {
          // eslint-disable-next-line eqeqeq
          if (res.code == 1) {
            content.status = 3;
            emit('resetStatus');
            Toast.success(`奖金领取成功！`);
          } else {
            Toast(res.msg || res.message);
          }
        })
        .finally(() => {
          receiveLoading.value = false;
        });
    }

    const { proxy }: any = getCurrentInstance();

    const isShow = ref(true);

    function scroll() {
      isShow.value = proxy.$refs['table'].scrollLeft < 380;
    }
    return { setStatus, toGetPrice, parseTime, scroll, isShow };
  }
});
</script>

<style lang="less" scoped>
.get-button {
  background-color: #808080;
  height: 26px;
  line-height: 26px;
  border-radius: 13px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  width: 80px;
  cursor: not-allowed;
}
.is-allow {
  background-image: linear-gradient(to right, #12dedf, #07c79c);
  color: #130e0e;
  cursor: pointer;
}
.tiro-task-table {
  overflow: auto;
  width: calc(100% - 30px);
  margin: auto;
  border-radius: 8px;
  //border-bottom: 1px #2d363d solid;
  //position: relative;
  &::before {
    position: absolute;
    content: '';
    display: var(--display);
    height: (100% - 15px);
    width: 40px;
    border-radius: 8px;
    background-image: linear-gradient(to right, #2d363d00, #2d363d);
    //background-color: #1c2227;
    right: 15px;
  }
  &::after {
    position: absolute;
    content: '';
    display: none;
    height: (100% - 15px);
    width: 10px;
    border-radius: 8px;
    background-image: linear-gradient(to right, #2d363d, #2d363d00);
    //background-color: #1c2227;
    left: 15px;
    top: 0;
  }
  > div {
    display: flex;
    justify-content: space-between;
    > div {
      height: 40px;
      line-height: 40px;
      text-align: center;
      width: 100px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      &:first-child {
        width: 60px;
      }
      &:last-child {
        width: 160px;
      }
    }
  }
  .table-header {
    background-color: #3e4a53;
    border-radius: 8px;
    width: 720px;
    > div {
      color: #fff;
      font-size: 14px;
    }
  }
  .table-body {
    border-radius: 8px;
    width: 720px;
    > div {
      color: #c2cdd5;
      font-size: 13px;
    }
  }
  .has-back {
    background-color: #2d363d;
  }
}
</style>
