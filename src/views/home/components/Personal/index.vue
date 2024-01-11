<template>
  <div class="v-personal">
    <div class="v-personal-info">
      <div v-if="userInfo.id" class="v-personal-icon">
        <van-image width="44" height="44" :src="userInfo.avatar_url">
          <template #loading>
            <img style="width: 44px; height: 44px;" :src="defaultImage">
          </template>
          <template #error>
            <img style="width: 44px; height: 44px;" :src="defaultImage">
          </template>
        </van-image>
        <span class="v-personal-icon-svg">V{{ userInfo.vip_current_level }}</span>
      </div>
      <div v-if="userInfo.id" class="v-personal-price">
        <div class="v-personal-price-name">
          <span>{{ userInfo.username }}</span>
        </div>
        <div class="v-personal-price-number">
          <span>{{ priceToFixed(userInfo.available_balance) }}</span>
        </div>
      </div>
      <div v-if="!userInfo.id" class="v-personal-info-no" @click="goPath('Login')">
        <van-image width="44" height="44" :src="defaultImage" />
        <span>
          请登录您的账号
        </span>
      </div>
    </div>
    <div class="v-personal-wallet">
      <div
        class="v-personal-wallet-text v-personal-wallet-deposit"
        @click="goPath('Recharge')"
      >
        <img :src="depositIcon">
        <span>存款</span>
      </div>
      <div
        class="v-personal-wallet-text v-personal-wallet-withdraw"
        @click="goPath('Withdraw')"
      >
        <img :src="withdrawIcon">
        <span>取款</span>
      </div>
      <div
        class="v-personal-wallet-text v-personal-wallet-transfer"
        @click="goPath('Transfer')"
      >
        <img :src="transferIcon">
        <span>转账</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onActivated, onMounted } from 'vue';
import store from '@/store/index.js'
import { useRouter } from 'vue-router'
import { priceToFixed } from '@/utils/index.js'
import { getPersonalInfo } from '@/api/user.js'

export default defineComponent({
  setup() {
    const router = useRouter()
    const defaultImage = require('@/assets/home/defaultImage.png')
    const { proxy }: any = getCurrentInstance();
    const userInfo = computed(() => store.getters.getUserInfo)
    /**
     * 存款图标
     */
    const depositIcon = require('@/assets/personal/deposit-icon.png')
    /**
     * 取款图标
     */
    const withdrawIcon = require('@/assets/personal/withdraw-icon.png')
    /**
     * 转账图标
     */
    const transferIcon = require('@/assets/personal/transfer-icon.png')
    const goPath = (row: string) => {
      router.push({ name: row, query: { home: 1 }})
    }
    const getUserInfo = async() => {
      const userInfoData = await getPersonalInfo()
      if (userInfoData.data) {
        store.commit('user/SET_USER_INFO', JSON.stringify(userInfoData.data))
      }
    }
    onMounted(() => {
      proxy.mittBus.on('getUserInfo', () => {
        if (userInfo.value.id) {
          getUserInfo()
        }
      });
    })
    // getUserInfo
    onActivated(() => {
      if (userInfo.value.id) {
        getUserInfo()
      }
    })
    return {
      depositIcon,
      withdrawIcon,
      transferIcon,
      userInfo,
      defaultImage,
      priceToFixed,
      goPath,
      getUserInfo
    }
  }
})
</script>

<style lang="less" scoped>
.v-personal {
  display: flex;
  align-items: center;
  height: 64px;
  margin: 10px 15px 4px 15px;
  background-color: #2d363d;
  border-radius: 8px;
  justify-content: space-between;
  overflow: hidden;
  &-info {
    display: flex;
    align-items: center;
    .v-personal-info-no {
      display: flex;
      align-items: center;
      margin-left: 7px;
      :deep(.van-image) {
        border-radius: 44px;
        overflow: hidden;
        margin-right: 11px;
        background: #fff;
      }
      span {
        font-size: 13px;
        color: #fff;
      }
    }
  }
  &-icon {
    position: relative;
    display: flex;
    align-items: center;
    margin: 0 10px 0 7px;
    :deep(.van-image__img) {
      border-radius: 44px;
    }
    &-svg {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: -4px;
      right: -4px;
      min-width: 16px;
      height: 9px;
      font-size: 8px;
      text-align: center;
      color: #2d363d;
      background-color: #ffd803;
      border-radius: 2px;
    }
  }
  &-price {
    color: #8d9da9;
    font-size: 12px;
    &-name {
      line-height: 20px;
      span {
        font-size: 13px;
        color: #8d9da9;
      }
    }
    &-number {
      line-height: 20px;
      span {
        font-size: 14px;
        color: #fff;
      }
    }
  }
  &-wallet {
    display: flex;
    &-text {
      display: flex;
      flex-direction: column;
      flex: 1;
      align-items: center;
      span {
        margin-top: 10px;
        font-size: 13px;
        color: #8d9da9;
      }
    }
    &-deposit {
      margin-right: 20px;
      img {
        width: 29px;
      }
      span {
        margin-top: 9px;
      }
    }
    &-withdraw {
      margin-right: 20px;
      justify-content: center;
      img {
        width: 24px;
      }
      span {
        margin-top: 12px;
      }
    }
    &-transfer {
      margin-right: 10px;
      justify-content: flex-end;
      img {
        width: 28px;
      }
    }
  }
}
</style>
