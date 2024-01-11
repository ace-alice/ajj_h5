<template>
  <div class="ip-err-main">
    <div class="ip-err-main-title">抱歉，您所在的地区受到限制</div>
    <div class="ip-err-main-address">
      {{ errorInfo }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: '',
  setup() {
    const route = useRoute()
    const errorInfo = computed(() => {
      return route.query.info || ''
    })
    return {
      errorInfo
    }
  }
})
</script>

<style lang="less" scoped>
.ip-err-main {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-image: url('../../../assets/err/ip-error.webp');
  background-size: 187px 144px;
  background-repeat: no-repeat;
  background-position: center;
  font-family: PingFang-SC;
  &-title {
    display: flex;
    margin-top: 150px;
    font-size: 16px;
    font-weight: 500;
    color: #3e4a53;
  }
  &-address {
    display: flex;
    margin-top: 10px;
    font-size: 12px;
    font-weight: 500;
    color: #3e4a53;
  }
}
</style>
