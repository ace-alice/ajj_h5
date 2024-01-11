<template>
  <div class="v-setting-accountSecurity">
    <PubHeader :right-icon="false" />
    <div class="v-setting-accountSecurity-main">
      <van-cell-group inset>
        <van-cell value="可修改" is-link>
          <template #title>
            <span class="custom-title">账户密码</span>
          </template>
        </van-cell>
        <van-cell value="未设置" is-link>
          <template #title>
            <span class="custom-title">交易密码</span>
          </template>
        </van-cell>
        <van-cell value="138****5263" is-link>
          <template #title>
            <span class="custom-title">账号绑定</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PubHeader from '@/components/PubHeader/index.vue'
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    PubHeader
  },
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
    return {
      goPath
    }
  }
})
</script>

<style lang="less" scoped>
.v-setting-accountSecurity {
  &-main {
    margin-top: 48px;
    :deep(.van-cell-group--inset) {
      margin: 0 15px 25px 15px;
    }
    :deep(.van-cell) {
      background-color: #2d363d;
      color: #fff;
      margin-bottom: 5px;
      border-radius: 4px;
      font-weight: 300;
      font-size: 12px;
    }
    :deep(.van-cell::after) {
      border-bottom: 0;
    }
    :deep(.van-cell-group) {
      background-color: #1c2227;
      border-radius: 0;
    }
    :deep(.van-cell__right-icon) {
      font-size: 12px;
    }
  }
}
</style>
