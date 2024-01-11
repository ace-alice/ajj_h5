<template>
  <div ref="JoinUs" class="v-join-us" @scroll="scrollHandle">
    <div ref="JoinUsBox" class="v-join-us-box">
      <van-image width="100%" style="min-height: 100vh" :src="agentIngUrl">
        <template #error>
          <div />
        </template>
        <template #loading>
          <div />
        </template>
      </van-image>
    </div>
    <pubHeader :right-icon="false" :style="{ background: '#1c2227' + op }" />
    <div v-if="isAgent.isToAgent" class="v-join-us-button" @click.stop="toPath({ name: 'Agent' })">
      进入代理系统
    </div>
    <div v-if="isAgent.isApply" class="v-join-us-button" @click.stop="toJoinUs">
      申请成为代理
    </div>

    <van-popup v-model:show="formShow">
      <div class="v-form-box">
        <div class="v-form-title">
          <span>申请成为代理</span>
        </div>
        <div class="v-form-body">
          <div class="v-form-body-title">
            <span>账号：</span>
            <span>{{ getUserInfo.username }}</span>
          </div>
          <div class="v-form-body-title">
            联系方式
          </div>
          <div class="v-form-body-type">
            <van-dropdown-menu :overlay="false" teleport="body">
              <van-dropdown-item v-model="form.connect_type" :options="connectTypeOptions" class="van-dropdown-top" />
            </van-dropdown-menu>
          </div>

          <van-field v-model="form.connect" class="van-field-cell" placeholder="请输入" />
          <!-- <div class="v-form-body-title">
            下级会员账号
          </div>
          <van-field v-model="form.member_name" class="van-field-cell" placeholder="请输入" /> -->
          <div class="v-form-body-title">
            备注
          </div>
          <van-field v-model="form.remark" class="van-field-cell" placeholder="请输入" />
        </div>
        <div class="v-form-footer">
          <div @click="pauseJoin">取消</div>
          <div @click.stop="doJoinUs">确定</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import pubHeader from '@/components/PubHeader/index.vue';
import toPathHook from '@/hooks/toPath';
import { useStore } from 'vuex';
import { toBeAgent, agentSelfApply } from '@/api/agent.js';
import { useRoute } from 'vue-router';
import { getAgentImage } from '@/api/agent.js';
import { Toast } from 'vant'

const defaultForm = {
  connect_type: 1,
  connect: null,
  member_name: null,
  remark: null
};

export default defineComponent({
  name: 'JoinUs',
  components: {
    pubHeader
  },
  setup() {
    const { toPath } = toPathHook();

    const route = useRoute();

    const store = useStore();

    const formShow = ref(false);

    const form = reactive({
      connect_type: 1,
      connect: null,
      member_name: null,
      remark: null
    });

    const connectTypeOptions = [
      { text: '微信', value: 1 },
      { text: 'QQ', value: 2 },
      { text: 'Telegram', value: 3 }
    ];

    function toJoinUs() {
      formShow.value = true;
    }

    const isApplyAgentId = computed(() => {
      return route.query.isApply || false;
    });

    const getUserInfo = computed(() => {
      return store.getters.getUserInfo;
    });

    const isAgent = computed(() => {
      return {
        isToAgent: [1, 2].includes(Number(getUserInfo.value.account_type)) && !isApplyAgentId.value,
        isApply: [0, 3].includes(Number(getUserInfo.value.account_type)) && !isApplyAgentId.value
      };
    });

    function doJoinUs() {
      agentSelfApply(form).then((res: any) => {
        if (+res.code === 1) {
          pauseJoin();
        }
      }).catch((err: any) => {
        Toast.fail(err.msg || err.message)
      })
    }

    const { proxy }: any = getCurrentInstance();

    const op = ref('00');

    function scrollHandle() {
      const num = proxy.$refs['JoinUs'].scrollTop;
      op.value = String(num > 48 ? '' : Math.floor(num));
    }

    function pauseJoin() {
      Object.assign(form, defaultForm);
      formShow.value = false;
    }

    const agentIngUrl = ref('');

    function getAgentImg() {
      getAgentImage().then((res: any) => {
        if (+res.code === 1) {
          agentIngUrl.value = res.data.filePath;
        }
      });
    }

    onMounted(() => {
      getAgentImg();
    });

    return {
      toPath,
      isAgent,
      toJoinUs,
      formShow,
      form,
      connectTypeOptions,
      doJoinUs,
      pauseJoin,
      getUserInfo,
      scrollHandle,
      op,
      agentIngUrl
    };
  }
});
</script>

<style lang="less" scoped>
.v-join-us {
  height: 100%;
  width: 100%;
  overflow: auto;
  .v-join-us-box {
    width: 100vw;
    img {
      width: 100%;
    }
  }

  .v-join-us-button {
    position: fixed;
    bottom: 35px;
    left: 15px;
    width: calc(100% - 30px);
    height: 40px;
    border-radius: 20px;
    background-image: linear-gradient(to right, #12dedf, #07c79c);
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: PingFang-SC, serif;
    font-size: 14px;
    color: #191414;
    z-index: 2000;
  }
}
:deep(.van-popup) {
  background: none;
}
.v-form-box {
  background-color: #2d363d;
  width: 70vw;
  border-radius: 8px;
  overflow: hidden;
  .v-form-title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    font-family: PingFang-SC, serif;
    color: #fff;
    background-color: #3e4a53;
  }
  .v-form-body {
    width: 100%;
    padding: 0 15px 15px;
    :deep(.van-field__control) {
      color: #fff;
    }
    .van-field-cell {
      border-radius: 8px;
      background-color: #3e4a53;
      padding: 7px 15px;
      width: calc(100% - 30px);
      &::after {
        display: none;
      }

      .van-field__left-icon {
        margin-right: 10px;
      }
      .van-icon {
        color: #fff;
        font-size: 20px;
      }
    }
    .v-form-body-title {
      color: #94a5b1;
      font-size: 12px;
      margin: 15px 5px;
    }
    .v-form-body-type {
      width: calc(100% - 30px);
      // background-color: #20272d;
      margin-bottom: 15px;
      overflow: hidden;
      font-size: 12px;
      height: 40px;

      :deep(.van-popup--top) {
        top: 30px;
      }

      :deep(.van-dropdown-menu) {
        height: 40px;
        border-radius: 8px;
        overflow: hidden;
        background: #3e4a53;
        .van-dropdown-menu__bar {
          height: 40px;
          background: #3e4a53;
          .van-dropdown-menu__title {
            width: calc(100% - 30px);
            padding: 0;
            display: flex;
            justify-content: space-between;
            color: #94a5b1;
            font-size: 12px;
          }
        }
        .van-cell {
          width: calc(100% - 30px);
          margin: auto;
          height: 40px;
          line-height: 40px;
          padding: 0 20px;
          background: #20272d;
          color: #fff;
          .van-cell__title {
            // color: #fff;
            font-size: 12px;
          }
          .van-icon {
            display: none;
          }
        }
        .van-dropdown-item__option--active {
          color: #07c79c !important ;
        }
      }

      .v-form-body-type-title {
        height: 35px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: #3e4a53;
        color: #fff;
        .icon {
          font-size: 18px;
        }
        * {
          margin: 0 10px;
        }
      }
      .v-form-body-type-body {
        width: 100%;
        > div {
          width: calc(100% - 20px);
          padding: 10px 0;
          margin: auto;
          color: #fff;
          + div {
            border-top: 0.5px solid #3e4a5350;
          }
        }
      }
    }
  }
  .v-form-footer {
    display: flex;
    & > div {
      width: 50%;
      text-align: center;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      &:nth-child(1) {
        background-color: #3e4a53;
        color: #94a5b1;
      }
      &:nth-child(2) {
        background-image: linear-gradient(to right, #12dedf, #07c79c);
        color: #1a242c;
      }
    }
  }
  :deep(::placeholder) {
    font-size: 12px;
    color: #94a5b1;
  }
  .van-dropdown-top {
    top: 125px !important;
  }
}
</style>
