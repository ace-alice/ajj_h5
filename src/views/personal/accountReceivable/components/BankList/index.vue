<template>
  <div class="item-list">
    <div class="item-warning">银行卡最多只能添加5个</div>
    <transition-group
      name="more"
      appear
      :css="false"
      @before-enter="beforeEnter"
      @enter="paragraphEnter"
    >
      <div
        v-for="(info, index) in infoList"
        :key="info.id"
        class="account-bank"
        :class="`back-${index % 3}`"
        :data-index="index % 10"
      >
        <div class="bank-card-top">
          <div class="bank-card-top-l">
            <van-image :src="info.bank_logo" width="20" height="20">
              <template #error>
                <img :src="bankDefaultImage" style="width:20px" alt="">
              </template>
              <template #loading>
                <img :src="bankDefaultImage" style="width:20px" alt="">
              </template>
            </van-image>
            <span>{{ info.bank_name }}</span>
            <div v-if="info.bank_status === 2" class="maintain-title">维护中</div>
          </div>
          <div class="bank-card-top-r">
            {{ info.update_time || info.create_time }}
          </div>
        </div>
        <div class="bank-card-mid">
          {{ dealWithCardNumber(info.bank_account) }}
        </div>
        <div class="bank-card-bottom">
          <span v-if="info.bank_default">当前默认</span>
          <span
            v-else
            class="no-active"
            @click.stop="setDefault(info)"
          >设为默认</span>
        </div>
        <div v-if="info.bank_status === 2" class="bank-maintain" />
      </div>
      <div
        v-show="infoList.length < 5 && !loading"
        key="add"
        class="bank-add"
        :data-index="infoList.length"
        @click="goAddBankCard"
      >
        <span>
          <van-icon name="add-o" />
        </span>
        <span>添加银行卡账户（{{ infoList.length }}/5）</span>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import listAnimateHook from '@/hooks/listAnimate'
import { defineComponent, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getBankList, setDefaultApi } from '@/api/accountReceivable.js'
import defaultImages from '@/hooks/defaultImages'
import { Toast } from 'vant'
import { dealWithCardNumber } from '@/utils/index.js'

export default defineComponent({
  setup() {
    const loading = ref(true)

    const router = useRouter()
    /**
     * 银行卡列表
     */
    const infoList = ref([])

    /**
     * 跳转添加银行卡账户
     */
    const goAddBankCard = () => {
      if (infoList.value.length > 4) return Toast('银行卡最多只能添加5个')
      router.push({ name: 'AddBankCard' })
    }

    function getItemList() {
      getBankList()
        .then((res: any) => {
          if (res.code == 1) {
            infoList.value = res.data
          }
        })
        .finally(() => {
          setTimeout(() => {
            loading.value = false
          }, 20)
        })
    }

    function setDefault(row: any) {
      setDefaultApi({ id: row.id, bank_default: 1 }).then((res: any) => {
        if (res.code == 1) {
          getItemList()
          Toast(res.msg || res.message)
        }
      })
    }

    const { beforeEnter, paragraphEnter } = listAnimateHook()
    const { bankDefaultImage } = defaultImages()

    onMounted(() => {
      nextTick(() => {
        getItemList()
      })
    })

    return {
      infoList,
      beforeEnter,
      paragraphEnter,
      goAddBankCard,
      loading,
      getItemList,
      bankDefaultImage,
      setDefault,
      dealWithCardNumber
    }
  }
})
</script>

<style lang="less" scoped>
.item-list {
  width: calc(100% - 30px);
  margin: 90px auto;
  .item-warning {
    font-size: 12px;
    color: #94a5b1;
    padding-left: 10px;
    margin-bottom: 15px;
  }
  .account-bank {
    position: relative;
    display: flex;
    height: 110px;
    width: calc(100% - 30px);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-bottom: 10px;
    flex-direction: column;
    justify-content: center;
    padding: 0 15px;
    .bank-card-top {
      display: flex;
      position: relative;
      justify-content: space-between;
      align-items: center;
      &-l {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 500;
        color: #fff;
        span {
          margin-left: 6px;
        }
        :deep(.van-image__img) {
          -webkit-filter: brightness(100);
          filter: brightness(100);
        }
      }
      &-r {
        font-size: 11px;
        font-weight: 300;
        color: #dbd5fe;
      }
      .maintain-title {
        position: absolute;
        right: 14px;
        z-index: 101;
        font-weight: bold;
      }
    }
    .bank-card-mid {
      display: flex;
      margin: 10px 0 10px 23px;
      font-size: 24px;
      font-weight: bold;
      color: #fff;
    }
    .bank-card-bottom {
      display: flex;
      justify-content: flex-end;

      span {
        padding: 0 10px;
        line-height: 22px;
        height: 22px;
        border-radius: 11px;
        font-size: 11px;
        color: #fff;
      }
    }
    .bank-maintain {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.3);
    }
  }
  .back-0 {
    background-image: url('../../../../../assets/bank/bank-bg1.png');
  }
  .back-1 {
    background-image: url('../../../../../assets/bank/bank-bg2.png');
  }
  .back-2 {
    background-image: url('../../../../../assets/bank/bank-bg3.png');
  }
  .no-active {
    background-color: #ffffff40;
  }
  .bank-add {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 110px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-color: #2d363d;
    border-radius: 8px;
    span:nth-child(1) {
      color: #fff;
      margin-bottom: 10px;
      font-size: 32px;
      color: #07c79c;
    }
    span:nth-child(2) {
      font-size: 11px;
      color: #94a5b1;
    }
  }
}
</style>
