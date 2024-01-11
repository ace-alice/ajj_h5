<template>
  <div class="v-guess-details">
    <div class="v-station-letter-Details-header">
      <div class="v-header-l">
        <svg-icon
          class="personal-menu"
          icon-class="user-back"
          @click="goBack"
        />
      </div>
      <div>交易详情</div>
      <div></div>
    </div>
    <transition
      name="more"
      appear
      v-bind:css="false"
      v-on:before-enter="beforeEnter"
      v-on:enter="paragraphEnter"
    >
      <div class="v-guess-details-main" v-bind:data-index="3">
        <div class="guess-header">￥{{ detail.amount }}</div>
        <div class="guess-info">
          <div>
            <div>交易类型</div>
            <div>{{ detail.order_name }}</div>
          </div>
          <div>
            <div>交易时间</div>
            <div>{{ detail.create_time }}</div>
          </div>
          <div>
            <div>交易单号</div>
            <div>
              {{ detail.other_id }}
              <span style="margin-left:10px"
                ><Clipboard :message="detail.other_id"
              /></span>
            </div>
          </div>
          <div>
            <div>备注</div>
            <div class="description">{{ detail.title_cn }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, ref } from 'vue'
import PubHeader from '@/components/PubHeader/index.vue'

import Clipboard from '@/components/Clipboard/index.vue'
import listAnimateHook from '@/hooks/listAnimate'

export default defineComponent({
  components: {
    PubHeader,
    Clipboard
  },
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
  setup() {
    function setColor(num: number) {
      const n = Number(num)
      if (n > 0) {
        return ['#ee0a24', '+']
      } else if (n < 0) {
        return ['#07c160', '-']
      } else {
        return ['#fff', '']
      }
    }

    const { proxy } = getCurrentInstance() as any

    function goBack() {
      proxy.mittBus.emit('changeTranShowDetail', false)
    }

    const { beforeEnter, paragraphEnter } = listAnimateHook()

    return { setColor, beforeEnter, paragraphEnter, goBack }
  }
})
</script>

<style lang="less" scoped>
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
}
</style>
