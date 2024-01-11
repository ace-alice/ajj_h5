<template>
  <div class="v-agent-list-item">
    <div class="v-agent-list-item-title">
      <div class="v-agent-list-item-title-left">
        <svg-icon icon-class="agent-avatar" class="icon-class" />
        <span>{{ item.username }}</span>
        <Clipboard :message="item.username" class="icon-class" />
      </div>
      <div>
        <van-icon
          v-show="!isCurrent && isClick && !isLen"
          name="arrow"
          class="van-icon-arrow"
          @click.stop="checkNextLevel"
        />
        <van-icon
          v-show="isLen"
          name="arrow"
          class="van-icon-arrow van-icon-arrow-back"
          @click.stop="checkBackLevel"
        />
      </div>
    </div>
    <div class="v-agent-list-item-body">
      <div class="v-agent-list-item-body-left">
        <div>直属代理: {{ item.direct_p_count }}</div>
        <div>直属会员: {{ item.direct_m_count }}</div>
      </div>
      <div class="v-agent-list-item-body-right">
        <div>全部代理: {{ item.all_p_count }}</div>
        <div>全部会员: {{ item.all_m_count }}</div>
      </div>
      <div class="v-agent-list-item-body-center">
        <div class="v-agent-list-item-body-center-login">
          登录时间: {{ item.login_time }}
        </div>
        <div class="v-agent-list-item-body-center-no-login">
          <span v-show="Number(item.login_diff_days)>0">近{{ item.login_diff_days }}天未登录</span>
        </div>
      </div>
      <div class="v-agent-list-item-body-bottom">
        <div class="v-agent-list-item-body-bottom-reg">
          注册时间: {{ item.login_time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Clipboard from '@/components/Clipboard/index.vue'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'AgentListItem',
  components: { Clipboard },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isCurrent: {
      type: Boolean,
      default: false
    },
    isLen: {
      type: Boolean,
      default: false
    },
    isAgentName: {
      require: false,
      type: Object
    }
  },
  emits: ['checkNext', 'checkBack'],
  setup(props, { emit }) {
    const isClick = computed(() => {
      return props.item.hierarchy > 0 && props.item.hierarchy < 3
    })

    function checkNextLevel() {
      emit('checkNext', props.item.username)
    }

    function checkBackLevel() {
      emit('checkBack', props.isAgentName);
    }

    return { checkNextLevel, isClick, checkBackLevel }
  }
})
</script>

<style lang="less" scoped>
.v-agent-list-item {
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  width: 100%;

  + .v-agent-list-item {
    margin-top: 10px;
  }

  .v-agent-list-item-title {
    height: 40px;
    width: 100%;
    background-color: #45515b;
    display: flex;
    align-items: center;
    color: #fff;
    justify-content: space-between;

    .v-agent-list-item-title-left {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 14px;

      .van-icon-user {
        font-size: 24px;
        margin: 0 15px;
      }
    }

    .van-icon-arrow {
      font-size: 16px;
      margin: 0 15px;
      color: #94a5b1;
    }
    .van-icon-arrow-back {
      transform: rotate(180deg)
    }
  }

  .v-agent-list-item-body {
    height: 90px;
    width: 100%;
    background-color: #2d363d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #bbc6cf;
    flex-wrap: wrap;

    div {
      flex-shrink: 0;
    }

    .v-agent-list-item-body-left {
      flex-grow: 1;
      padding-left: 15px;

      div {
        margin: 5px 0;
      }
    }

    .v-agent-list-item-body-right {
      padding-right: 15px;
      width: 35%;

      div {
        margin: 5px 0;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
        text-overflow: ellipsis;
      }
    }

    .v-agent-list-item-body-center {
      width: 100%;
      display: flex;
      justify-content: space-between;
      color: #75828d;

      .v-agent-list-item-body-center-login {
        margin-left: 15px;
      }

      .v-agent-list-item-body-center-no-login {
        margin-right: 15px;
      }
    }

    .v-agent-list-item-body-bottom {
      width: 100%;
      color: #75828d;

      .v-agent-list-item-body-bottom-reg {
        margin-left: 15px;
        margin-bottom: 10px;
      }
    }
  }

  .icon-class {
    font-size: 16px;
    font-weight: bold;
    margin: 0 15px;
  }
}
</style>
