<template>
  <div class="v-group2">
    <van-cell title="我的返佣比例" is-link to="/rebate">
      <template #icon>
        <svg-icon icon-class="fanyongbili" class="svg-class" />
      </template>
    </van-cell>
    <van-cell v-show="+agentInfo.hierarchy !== 3" title="申请会员为下级代理" is-link @click.stop="toJoinUs">
      <template #icon>
        <svg-icon icon-class="shenqingdaili" class="svg-class" />
      </template>
    </van-cell>
    <van-cell title="我的推广码" :value="agentInfo.invitation_code">
      <template #icon>
        <svg-icon icon-class="tuiguangma" class="svg-class" />
      </template>
      <template #right-icon>
        <Clipboard :message="agentInfo.invitation_code" />
      </template>
    </van-cell>
    <van-cell title="我的推广链接" :value="agentInfo.invitation_url">
      <template #icon>
        <svg-icon icon-class="agent-link" class="agent-link" />
      </template>
      <template #right-icon>
        <Clipboard :message="agentInfo.invitation_url" />
      </template>
    </van-cell>
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
          <div class="v-form-body-title">
            下级会员账号
          </div>
          <van-field v-model="form.member_name" class="van-field-cell" placeholder="请输入" />
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
import toPathHook from '@/hooks/toPath';
import { computed, defineComponent, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import Clipboard from '@/components/Clipboard/index.vue';
import { toBeAgent } from '@/api/agent.js';
import { Toast } from 'vant';

const defaultForm = {
  connect_type: 1,
  connect: null,
  member_name: null,
  remark: null
};

export default defineComponent({
  name: 'Group2',
  components: { Clipboard },
  setup() {
    const { toPath } = toPathHook();

    const store = useStore();

    const formShow = ref(false);

    const form:any = reactive({
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

    const getUserInfo = computed(() => {
      return store.getters.getUserInfo;
    });

    const agentInfo = computed(() => {
      return store.getters.agentInfo;
    });

    function doJoinUs() {
      if (form.connect.length < 6 || form.connect.length > 32) {
        return Toast.fail('请输入6-32位联系方式')
      }
      if (form.member_name.length < 6 || form.member_name.length > 20) {
        return Toast.fail('请输入6-20位下级会员账号')
      }
      if (!form.remark) {
        return Toast.fail('请输入备注')
      }
      toBeAgent(form).then((res: any) => {
        if (+res.code === 1) {
          pauseJoin();
          Toast.success(res.msg || res.message);
        }
      }).catch((err:any) => {
        Toast.fail(err.msg || err.message)
      })
    }

    function pauseJoin() {
      Object.assign(form, defaultForm);
      formShow.value = false;
    }

    return {
      toPath,
      agentInfo,
      doJoinUs,
      toJoinUs,
      formShow,
      form,
      connectTypeOptions,
      pauseJoin,
      getUserInfo
    };
  }
});
</script>

<style lang="less" scoped>
.v-group2 {
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

.agent-link {
  margin-right: 10px;
  width: 15px;
  height: 15px;
}

:deep(.van-cell__value) {
  padding-right: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

:deep(.van-popup) {
  //background: none;
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
    font-family: PingFang-SC;
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

      :deep(.van-dropdown-menu) {
        height: 40px;
        border-radius: 8px;
        overflow: hidden;
        background: #3e4a53;

        .van-dropdown-menu__bar {
          height: 40px;
          background: #3e4a53;

          .van-dropdown-menu__title {
            display: inline-block;
            width: calc(100% - 30px);
            padding: 0;
            display: flex;
            justify-content: space-between;
            color: #94a5b1;
            font-size: 12px;
          }
        }

        .van-popup--top {
          top: 30px;
          width: calc(100% - 30px);
          left: 15px;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }

        .van-cell {
          width: calc(100% - 30px);
          margin: auto;
          height: 40px;
          line-height: 40px;
          padding: 0 20px;
          //background: #20272d !important;
          color: #fff;

          .van-cell__title {
            // color: #fff;
            font-size: 12px;
          }

          .van-icon {
            display: none;
          }

          & + .van-cell {
            border-top: 1px #3e4a53 solid;
          }
        }

        .van-dropdown-item__option--active {
          color: #07c79c !important;
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
