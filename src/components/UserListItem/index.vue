<template>
  <div class="v-agent-list-item">
    <div class="v-agent-list-item-title">
      <div class="v-agent-list-item-title-left">
        <svg-icon icon-class="agent-avatar" class="icon-class" />
        <span>{{ item.username }}</span>
      </div>
      <!-- <div>
        <van-icon name="arrow" class="van-icon-arrow" />
      </div> -->
    </div>
    <div class="v-agent-list-item-body">
      <div class="v-agent-list-item-body-top">
        <div>
          <div>存款</div>
          <div class="count">{{ priceToFixed(item.total_deposit) }}</div>
        </div>
        <div>
          <div>取款</div>
          <div class="count">{{ priceToFixed(item.total_withdrawal) }}</div>
        </div>
        <div>
          <div>中心钱包余额</div>
          <div class="count">{{ priceToFixed(item.available_balance) }}</div>
        </div>
      </div>
      <div class="divider" />
      <div class="v-agent-list-item-body-center">
        <div class="v-agent-list-item-body-center-login">
          登录时间: {{ item.login_time }}
        </div>
        <div
          v-show="item.senior_member_username"
          class="v-agent-list-item-body-center-no-login"
        >
          上级代理：{{ item.senior_member_username }}
        </div>
      </div>
      <div class="v-agent-list-item-body-bottom">
        <div class="v-agent-list-item-body-bottom-reg">
          注册时间: {{ item.create_time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { priceToFixed, formatTime } from '@/utils/index.js'
import defaultImages from '@/hooks/defaultImages'

export default defineComponent({
  name: 'AgentListItem',
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          available_balance: '0.0000',
          avatar_id: 0,
          avatar_url: '',
          create_time: '',
          id: 0,
          login_time: '',
          senior_member_username: '',
          total_deposit: '0.0000',
          total_withdrawal: '0.0000',
          username: ''
        }
      }
    }
  },

  setup(props) {
    const notLogin30 = computed(() => {
      return Number(formatTime(props.item.login_time)) > 30
    })

    const { avatarDefaultImage } = defaultImages()

    return { priceToFixed, notLogin30, avatarDefaultImage }
  }
})
</script>

<style lang="less" scoped>
.icon-class {
  font-size: 16px;
  font-weight: bold;
  margin: 0 15px;
}
.v-agent-list-item {
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  width: 100%;
  + .v-agent-list-item {
    margin-top: 10px;
  }
  .v-agent-list-item-title {
    height: 40px;
    width: 100%;
    background-color: #45515b;
    display: flex;
    align-items: center;
    color: #fff;
    justify-content: space-between;
    .v-agent-list-item-title-left {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 14px;
      .van-icon-user {
        font-size: 24px;
        margin: 0 15px;
      }
    }
    .van-icon-arrow {
      font-size: 20px;
      margin: 0 15px;
      color: #94a5b1;
    }
  }
  .v-agent-list-item-body {
    height: 90px;
    width: 100%;
    background-color: #2d363d;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #bbc6cf;
    flex-wrap: wrap;
    div {
      flex-shrink: 0;
    }
    .v-agent-list-item-body-top {
      width: 100%;
      display: flex;
      justify-content: center;
      > div {
        width: 30%;
        text-align: center;
        div {
          margin: 5px auto;
        }
      }
      .count {
        font-weight: bold;
        color: #fff;
      }
    }
    .v-agent-list-item-body-center {
      width: 100%;
      display: flex;
      justify-content: space-between;
      color: #75828d;
      .v-agent-list-item-body-center-login {
        margin-left: 15px;
      }
      .v-agent-list-item-body-center-no-login {
        margin-right: 15px;
      }
    }
    .v-agent-list-item-body-bottom {
      width: 100%;
      color: #75828d;
      .v-agent-list-item-body-bottom-reg {
        margin-left: 15px;
        margin-bottom: 10px;
      }
    }
    .divider {
      width: calc(100% - 30px);
      height: 1px;
      background-color: #45515b;
      border-radius: 0.5px;
      margin-bottom: 5px;
    }
  }
}
</style>
