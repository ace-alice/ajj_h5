<template>
  <div class="v-agent-list">
    <div class="v-agent-list-header">
      <van-icon
        name="arrow-left"
        @click.stop="toPath({ name: 'UserReport' })"
      />
      <div class="v-agent-list-header-title">盈亏明细</div>
      <div />
    </div>
    <div class="v-agent-list-box">
      <transition
        name="more"
        appear
        v-bind:css="false"
        v-on:before-enter="beforeEnter"
        v-on:enter="paragraphEnter"
      >
        <UserReportDetailItem />
      </transition>
      <div class="empty" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import UserReportDetailItem from '@/components/UserReportDetailItem/index.vue'
import toPathHook from '@/hooks/toPath'
import listAnimateHook from '@/hooks/listAnimate'

export default defineComponent({
  name: 'AgentReportDetail',
  components: { UserReportDetailItem },
  setup() {
    const agent = ref('')

    const { toPath } = toPathHook()

    const { beforeEnter, paragraphEnter } = listAnimateHook()

    return { agent, toPath, beforeEnter, paragraphEnter }
  }
})
</script>

<style lang="less" scoped>
.v-agent-list-header {
  position: fixed;
  height: 40px;
  width: calc(100% - 30px);
  left: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  .v-agent-list-header-title {
    font-size: 14px;
    font-weight: bold;
    font-family: PingFang-SC;
  }
  :deep(.van-icon) {
    font-size: 20px;
  }
  .v-agent-list-header-right {
    background-image: linear-gradient(to right, #12dedf, #07c79c),
      linear-gradient(to bottom, #fff, #fff);
    font-family: PingFang-SC;
    font-size: 14px;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    cursor: pointer;
  }
}

.v-agent-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  font-family: PingFang-SC;

  .v-agent-list-box {
    width: calc(100% - 30px);
    margin: 50px auto 0px;
    flex-grow: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
}
</style>

<style>
body {
  --van-field-placeholder-text-color: #707d88 !important;
}
.empty {
  width: 100%;
  height: 10vh;
  flex-shrink: 0;
}
</style>
