<template>
  <div class="v-group">
    <van-cell-group inset>
      <van-cell is-link @click="goPath('AccountReceivable')">
        <template #title>
          <svg-icon icon-class="personal-avatar" />
          <span class="custom-title">收款账户管理</span>
        </template>
      </van-cell>
      <van-cell is-link @click="goPath('Activities')">
        <template #title>
          <svg-icon icon-class="sidebar-discount" />
          <span class="custom-title">我的活动</span>
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group inset>
      <van-cell is-link @click="goPath('DAndWRecords')">
        <template #title>
          <svg-icon icon-class="personal-deposit" />
          <span class="custom-title">存取款记录</span>
        </template>
      </van-cell>
      <van-cell is-link @click="goPath('TransactionRecord')">
        <template #title>
          <svg-icon icon-class="personal-record" />
          <span class="custom-title">交易记录</span>
        </template>
      </van-cell>
      <van-cell is-link @click="goPath('BettingRecord')">
        <template #title>
          <svg-icon icon-class="personal-bet" />
          <span class="custom-title">注单记录</span>
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group inset>
      <van-cell is-link @click="goPath('Bulletin')">
        <template #title>
          <svg-icon icon-class="personal-message" />
          <span class="custom-title">消息中心</span>
        </template>
      </van-cell>
      <van-cell is-link @click="goPath('ContactUs')">
        <template #title>
          <svg-icon icon-class="personal-us" />
          <span class="custom-title">联系我们</span>
        </template>
      </van-cell>
      <van-cell is-link @click="goPath('JoinUs')">
        <template #title>
          <svg-icon icon-class="personal-agent" />
          <span class="custom-title">合作加盟</span>
        </template>
      </van-cell>
      <van-cell is-link @click="goPath('HelpCenter')">
        <template #title>
          <svg-icon icon-class="personal-guide" />
          <span class="custom-title">帮助中心</span>
        </template>
      </van-cell>
      <van-cell is-link @click="goPath('Setting')">
        <template #title>
          <svg-icon icon-class="personal-setup" />
          <span class="custom-title">设置</span>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    /**
     * 使用路由
     */
    const router = useRouter()
    /**
     * 路由跳转
     * @param name
     */
    const goPath = (name: string) => {
      router.push({ name: name })
    }
    onMounted(() => {
      // console.log(111111111111)
    })
    return {
      goPath
    }
  }
})
</script>

<style lang="less" scoped>
.v-group {
  height: calc(100% - 310px);
  overflow: auto;
  :deep(.van-cell-group--inset) {
    margin: 0 5px 10px 5px;
  }
  :deep(.van-cell) {
    background-color: transparent;
    color: #fff;
    font-weight: 300;
    font-size: 12px;
  }
  :deep(.van-cell::after) {
    border-bottom: 0;
  }
  :deep(.van-cell-group) {
    padding-top: 6px;
    background-color: transparent;
    border-top: 1px solid #49535b;
    border-radius: 0;
  }
  :deep(.van-cell__right-icon) {
    font-size: 12px;
  }
  .custom-title {
    margin-left: 10px;
  }
}
</style>
