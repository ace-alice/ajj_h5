<template>
  <div class="v-agent-list">
    <div class="v-agent-list-header">
      <van-icon name="arrow-left" @click.stop="toPath({ name: 'Agent' })" />
      <div class="v-agent-list-header-title">返佣比例</div>
      <div />
    </div>
    <div class="v-agent-list-input">
      <div>序号</div>
      <div>盈亏总额</div>
      <div>本月有效活跃人数</div>
      <div>返佣比例</div>
    </div>
    <div class="v-agent-list-box">
      <transition-group
        name="more"
        appear
        v-bind:css="false"
        v-on:before-enter="beforeEnter"
        v-on:enter="paragraphEnter"
      >
        <div
          v-for="(item, index) in rebateInfo.config_arr"
          :key="index"
          :class="{ 'has-back': index % 2 == 1 }"
          v-bind:data-index="index + 1"
        >
          <div>{{ index + 1 }}</div>
          <div>≥{{ item.profitLossTotal }}</div>
          <div>≥{{ item.monthEActive }}</div>
          <div>{{ item.rebateRatio }}%</div>
        </div>
      </transition-group>

      <div class="empty" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, watch } from 'vue'
// import AgentListItem from '@/components/AgentListItem/index.vue'
import toPathHook from '@/hooks/toPath'
import { getRebateDetail } from '@/api/agent.js'
import listAnimateHook from '@/hooks/listAnimate'

export default defineComponent({
  name: 'AgentList',
  // components: { AgentListItem },
  setup() {
    const agent = ref('')

    const { toPath } = toPathHook()

    function getRebateDetailFun() {
      getRebateDetail().then((res: any) => {
        // console.log(res)
        if (+res.code === 1) {
          rebateInfo.value = res.data
        }
      })
    }

    const rebateInfo: Ref<any> = ref({})

    watch(
      () => rebateInfo.value,
      (newVal) => {
        if (newVal.config_json) {
          newVal.config_arr = JSON.parse(newVal.config_json)
        }
      }
    )
    const { beforeEnter, paragraphEnter } = listAnimateHook()
    onMounted(() => {
      getRebateDetailFun()
    })
    return {
      agent,
      toPath,
      getRebateDetailFun,
      rebateInfo,
      beforeEnter,
      paragraphEnter
    }
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

.table-tr {
  display: flex;
  align-items: center;
  border-radius: 8px;
  width: calc(100% - 30px);
  flex-shrink: 0;
  height: 40px;
  font-size: 13px;
  margin: 0 auto;
  div {
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }
  :nth-child(1) {
    width: 15%;
  }
  :nth-child(2) {
    width: 25%;
  }
  :nth-child(3) {
    flex-grow: 1;
  }
  :nth-child(4) {
    width: 25%;
  }
}

.v-agent-list {
  display: flex;
  flex-direction: column;
  height: 100px;
  width: 100%;
  font-family: PingFang-SC;
  .v-agent-list-input {
    .table-tr();
    margin: 50px auto 0px;
    background-color: #3e4a53;
    color: #fff;
  }
  .v-agent-list-box {
    width: 100%;
    flex-grow: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    > div {
      color: #bbc6cf;
      .table-tr();
    }
    .has-back {
      background-color: #2d363d;
    }
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
}
</style>
