<template>
  <div class="v-guess-details">
    <div class="v-station-letter-Details-header">
      <div class="v-header-l">
        <svg-icon class="personal-menu" icon-class="user-back" @click="goBack" />
      </div>
      <div>交易详情</div>
      <div />
    </div>
    <transition name="more" appear :css="false" @before-enter="beforeEnter" @enter="paragraphEnter">
      <div v-if="type === 'deposit'" class="v-guess-details-main" :data-index="3">
        <div class="guess-header" :class="{ 'is-cancel': +detail.order_status_client === 2 }">
          +￥{{ detail.recharge_amount }}
        </div>
        <div class="guess-info">
          <div>
            <div>交易状态</div>
            <div
              :style="{
                color: setStatus(Number(+detail.order_status_client))[1]
              }"
            >
              {{ setStatus(Number(+detail.order_status_client))[0] }}
            </div>
          </div>
          <div>
            <div>交易方式</div>
            <div>{{ detail.cash_type_name }}</div>
          </div>
          <div>
            <div>交易时间</div>
            <div>{{ detail.create_time }}</div>
          </div>
          <div>
            <div>订单编号</div>
            <div>
              {{ detail.order_number }}
              <span style="margin-left:10px"><Clipboard :message="detail.order_number" /></span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="v-guess-details-main" :data-index="3">
        <div class="guess-header" :class="{ 'is-cancel': +detail.draw_status_client === 2 }">
          ￥{{ detail.draw_amount }}
        </div>
        <div class="guess-info">
          <div>
            <div>交易状态</div>
            <div
              :style="{
                color: setStatus(Number(+detail.draw_status_client))[1]
              }"
            >
              {{ setStatus(Number(+detail.draw_status_client))[0] }}
            </div>
          </div>
          <div>
            <div>交易方式</div>
            <div>{{ detail.channel_name }}</div>
          </div>
          <div>
            <div>交易时间</div>
            <div>{{ detail.create_time }}</div>
          </div>
          <div>
            <div>订单编号</div>
            <div>
              {{ detail.draw_order }}
              <span style="margin-left:10px"><Clipboard :message="detail.draw_order" /></span>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="footer">对此订单有疑问？ 请联系<span class="online" @click.stop="callOnline">在线客服</span></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted } from 'vue';
import Clipboard from '@/components/Clipboard/index.vue';
import listAnimateHook from '@/hooks/listAnimate';
import { useRouter } from 'vue-router';

// import { getDepositDetail } from '@/api/dAndWRecord.js'

export default defineComponent({
  components: {
    Clipboard
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {};
      }
    },
    type: {
      type: String,
      default: 'deposit'
    }
  },
  setup(props) {
    function setStatus(status: number) {
      switch (status) {
        case 1:
          return ['成功', '#3ce20f'];

        case 3:
          return ['已取消', '#e81b1b'];

        case 4:
          return ['待处理', '#999'];
        default:
          return ['未知', '#999'];
      }
    }

    const { proxy }: any = getCurrentInstance();

    function goBack() {
      proxy.mittBus.emit('changeTranShowDetail', false);
    }

    // function getDepositDetailFun() {
    //   getDepositDetail({ id: props.detail.id }).then((res: any) => {
    //     console.log(res)
    //   })
    // }

    const { beforeEnter, paragraphEnter } = listAnimateHook();

    const router = useRouter();

    function callOnline() {
      router.push({ name: 'ContactUs' });
    }

    onMounted(() => {
      // getDepositDetailFun()
    });

    return { setStatus, beforeEnter, paragraphEnter, goBack, callOnline };
  }
});
</script>

<style lang="less" scoped>
.is-cancel {
  text-decoration: line-through;
}

.v-station-letter-Details-header {
  height: 40px;
  width: calc(100% - 30px);
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
}

.v-guess-details {
  overflow: auto;

  &-main {
    margin: 8px 15px 0 15px;

    .guess-header {
      height: 80px;
      line-height: 80px;
      background-color: #2d363d;
      border-radius: 8px;
      color: #fff;
      text-align: center;
      font-weight: 600;
      font-size: 21px;
    }

    .guess-info {
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      background-color: #2d363d;
      color: #fff;
      font-size: 12px;
      padding: 25px 25px 15px 15px;
      margin-top: 10px;

      div {
        display: flex;
        height: 36px;

        div:nth-child(1) {
          width: 80px;
          flex-shrink: 0;
          font-weight: 300;
          color: #b6c1cb;
        }

        div:nth-child(2) {
          flex-grow: 1;
          font-size: 13px;
          white-space: pre-wrap;
        }

        .description {
          color: #94a5b1;
        }
      }
    }
  }

  .num {
    font-weight: 600;
  }

  .footer {
    color: #fff;
    font-size: 12px;
    margin-top: 50px;
    text-align: center;

    .online {
      color: #0fd7cb;
      cursor: pointer;
    }
  }
}
</style>
