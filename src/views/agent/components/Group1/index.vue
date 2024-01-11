<template>
  <div class="v-group1">
    <van-cell v-show="+agentInfo.hierarchy !== 3" title="代理列表" is-link to="/agent-list">
      <template #icon>
        <svg-icon icon-class="daililiebiao" class="svg-class" />
      </template>
    </van-cell>
    <van-cell title="会员列表" is-link to="/user-list">
      <template #icon>
        <svg-icon icon-class="huiyuanliebiao" class="svg-class" />
      </template>
    </van-cell>
    <van-cell title="代理盈亏" is-link to="/agent-report">
      <template #icon>
        <svg-icon icon-class="dailiyingkui" class="svg-class" />
      </template>
    </van-cell>
    <van-cell title="会员盈亏" is-link to="/user-report">
      <template #icon>
        <svg-icon icon-class="huiyuanyingkui" class="svg-class" />
      </template>
    </van-cell>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Group1',
  setup() {
    const store = useStore();

    const agentInfo = computed(() => {
      return store.getters.agentInfo;
    });

    return { agentInfo };
  }
});
</script>

<style lang="less" scoped>
.v-group1 {
  width: 96%;
  margin: 10px 0;
  :deep(.van-cell) {
    background: none;
    color: #fff;
    font-size: 14px;
    font-family: PingFang-SC;
    align-items: center;
  }
  ::after {
    display: none;
  }
}
.svg-class {
  margin-right: 10px;
  font-size: 17px;
}
</style>
