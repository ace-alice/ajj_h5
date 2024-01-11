<template>
  <span
    class="copy_btn"
    data-clipboard-action="copy"
    :data-clipboard-text="message"
    ref="copy"
  >
    <!-- {{ $t('copy') }} -->
    <svg-icon icon-class="personal-copy"></svg-icon>
  </span>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, nextTick, onMounted } from 'vue'
import Clipboard from 'clipboard'
import { Toast } from 'vant'
// import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Clipboard',
  props: ['message'],
  setup(props) {
    // const i18n = useI18n()
    const { proxy } = getCurrentInstance() as any
    function handleCopy() {
      let clipboard = new Clipboard(proxy.$refs['copy'], {
        text: () => {
          return props.message
        }
      })

      clipboard.on('success', (e) => {
        // Toast(i18n.t('copySuccessfully'))
        Toast('复制成功')
      })
      clipboard.on('error', (e) => {
        // Toast(i18n.t('not_copy'))
        Toast('复制失败')
      })
    }
    onMounted(() => {
      nextTick(() => {
        handleCopy()
      })
    })
    return { handleCopy }
  }
})
</script>

<style lang="less" scoped>
// .copy_btn {
//   text-decoration: underline;
//   color: #4a85c3;
//   cursor: pointer;
// }
</style>
