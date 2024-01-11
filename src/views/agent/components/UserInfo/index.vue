<template>
  <div class="v-user-info-box">
    <div class="v-user-info-avatar">
      <van-image
        width="10em"
        height="10em"
        fit="cover"
        :src="agentInfo.avatar_url"
        round
      >
        <template #error>
          <img :src="avatarDefaultImage" style="width:100%" alt="">
        </template>
        <template #loading>
          <img :src="avatarDefaultImage" style="width:100%" alt="">
        </template>
      </van-image>
      <div class="v-user-info-avatar-name">
        <span>{{ agentInfo.username }}</span>
        <span class="v-vip">v{{ agentInfo.vip_current_level }}</span>
      </div>
    </div>

    <div class="v-user-info-top">
      <div class="v-user-info-top-list1">
        <div class="v-user-info-top-list1-left">
          <svg-icon icon-class="agent-gold" style="margin-right:5px" />
          <span>中心钱包</span>
        </div>
        <div class="v-user-info-top-list1-right">
          <div @click.stop="toPath({ name: 'Recharge' })">存款</div>
          <div
            class="v-user-info-top-list1-right-btn2"
            @click.stop="toPath({ name: 'Withdraw' })"
          >
            取款
          </div>
        </div>
      </div>
      <div class="v-user-info-top-list2">
        <span>¥{{
          priceToFixed(agentInfo?.available_balance) || '0.00'
        }}</span>
      </div>
    </div>
    <div class="v-user-info-bottom">
      <div class="v-user-info-bottom-list1">
        <div>
          <span>有效活跃人数：</span>
          <span>
            {{ agentInfo?.effective_number }}
            /
            {{ agentInfo?.number_distance }}
          </span>
        </div>
        <div>
          <span>盈亏总额：</span>
          <span>
            {{ agentInfo?.total_profit }}
            /
            {{ agentInfo?.profit_distance }}
          </span>
        </div>
      </div>
      <div class="v-user-info-bottom-list2">
        <div
          class="v-user-info-active"
          :style="{
            '--active-width':
              agentInfo?.progress+'%'
          }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import defaultImages from '@/hooks/defaultImages'
import toPathHook from '@/hooks/toPath'
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { priceToFixed } from '@/utils/index.js';

export default defineComponent({
  setup() {
    const { toPath } = toPathHook()

    const { avatarDefaultImage } = defaultImages()

    const store = useStore()

    const agentInfo = computed(() => {
      return store.getters.agentInfo
    })
    return { toPath, agentInfo, avatarDefaultImage, priceToFixed }
  }
})
</script>

<style lang="less" scoped>
:deep(.van-image) {
  background: none !important;

  img {
    background: none !important;
  }
}

.flex {
  display: flex;
  justify-content: center;
}

.flex-align-center {
  display: flex;
  align-items: center;
}

.v-user-info-box {
  height: 160px;
  width: calc(100% - 30px);
  background-color: #ffffff10;
  backdrop-filter: blur(5px);
  border-radius: 10px;
  margin-top: 100px;
  position: relative;
  font-family: PingFang-SC;

  .v-user-info-avatar {
    position: absolute;
    font-size: 5px;
    left: 17px;
    top: -35px;
    height: 50px;
    display: flex;
    align-items: center;

    .v-user-info-avatar-name {
      height: 15px;
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      margin-left: 5px;
      margin-bottom: 5px;

      .v-vip {
        display: inline-block;
        margin-left: 5px;
        width: 18px;
        height: 10px;
        line-height: 10px;
        text-align: center;
        background-color: #fbd601;
        border-radius: 3px;
        font-size: 9px;
        font-weight: 600;
        color: #000;
      }
    }
  }

  .v-user-info-top {
    height: 70px;
    width: 100%;
    margin-top: 30px;
    color: #fff;

    .v-user-info-top-list2 {
      margin-left: 35px;
      height: 45px;
      line-height: 45px;
      font-size: 24px;
    }

    .v-user-info-top-list1 {
      width: calc(100% - 45px);
      margin: 0 10px 0 35px;
      display: flex;
      justify-content: space-between;
      font-size: 14px;

      div {
        display: flex;
        align-items: center;
      }

      .v-user-info-top-list1-right {
        div {
          height: 24px;
          width: 70px;
          border: 0.5px solid #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 13px;
          font-size: 13px;

          + div {
            margin-left: 10px;
          }
        }

        .v-user-info-top-list1-right-btn2 {
          background-color: #ffffff40;
        }
      }
    }
  }

  .v-user-info-bottom {
    height: 60px;
    width: calc(100% - 40px);
    padding: 15px 0;
    margin: auto;

    .v-user-info-bottom-list1 {
      height: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #fff;
      margin-bottom: 2px;
    }

    .v-user-info-bottom-list2 {
      width: 100%;
      height: 3px;
      border-radius: 1.5px;
      background-color: #57646e;
      position: relative;

      .v-user-info-active {
        position: absolute;
        border-radius: 1.5px;
        height: 3px;
        background-image: linear-gradient(to right, #12dedf, #07c79c);
        width: var(--active-width);
        transition: width 1s linear;
      }
    }
  }
}
</style>
