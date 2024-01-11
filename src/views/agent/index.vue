<template>
  <div class="v-agent-box">
    <pubHeader :right-icon="false" path="Personal" />
    <UserInfo />
    <div class="v-agent-cell-box">
      <Group1 />
      <div class="divider"></div>
      <Group2 />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import pubHeader from '@/components/PubHeader/index.vue'
import UserInfo from './components/UserInfo/index.vue'
import Group1 from './components/Group1/index.vue'
import Group2 from './components/Group2/index.vue'
import { getAgentInfo } from '@/api/agent.js'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Agent',
  components: {
    pubHeader,
    UserInfo,
    Group1,
    Group2
  },
  setup() {
    const Loading = ref(true)

    const store = useStore()

    function getAgentInfoFun() {
      getAgentInfo()
        .then((result: any) => {
          if (result.code == 1) {
            store.commit('user/SET_AGENT_INFO', result.data)
          }
        })
        .finally(() => {
          Loading.value = false
        })
    }

    onMounted(() => {
      getAgentInfoFun()
    })
    return {}
  }
})
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
}
.v-agent-box {
  height: 100%;
  width: 100%;
  font-family: PingFang-SC;
  background-image: url('../../assets/agent/agent_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 200px;
  .flex();
  flex-direction: column;

  .v-agent-cell-box {
    width: 100%;
    height: calc(100% - 167px);
    flex: 1;
    overflow: auto;
    .flex();
    flex-direction: column;
  }
}
.divider {
  width: calc(100% - 30px);
  height: 0.5px;
  border-radius: 0.25px;
  background-color: #2d363d;
}
</style>
