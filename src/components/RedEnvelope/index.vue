<template>
  <div
    v-show="redEnvelopeHidden"
    ref="packet"
    class="v-red-envelope-box"
    @touchstart.once="redEnvelopeClick"
  />
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, nextTick, ref} from 'vue'

export default defineComponent({
  name: '',
  setup() {
    /**
     * 红包是否显示
     */
    const redEnvelopeHidden = ref(true)
    /**
     * 存放生成的动画实例
     */
    const redEnvelopeAnimation: any = ref(null)
    /**
     * 存放父组件传来的配置项
     */
    const redEnvelopeOptions: any = ref(null)
    /**
     * 记录红包是否已经掉落
     */
    const redEnvelopeIsDropped: any = ref(false)
    /**
     * 红包掉落时是什么方式旋转（顺/逆）
     */
    const redEnvelopeRotateComputed = ref(1)
    const { proxy } = getCurrentInstance() as any
    const openRedEnvelope = require('@/assets/activity/open-red-envelope.png')
    /**
     * 红包点击
     */
    const redEnvelopeClick = (e: any) => {
      nextTick(() => {
        redEnvelopeAnimation.value.stop()
        if (!redEnvelopeIsDropped.value) {
          redEnvelopeOptions.value.onDropped()
          redEnvelopeIsDropped.value = true
        }
        if (redEnvelopeHidden.value) {
          redEnvelopeOptions.value.onClick(e)
        }
        proxy.$refs['packet'].style.transform = 'rotate(0deg)'
        proxy.$refs['packet'].style.background = `url(${openRedEnvelope.value})`
        proxy.$refs['packet'].style.backgroundSize = 'contain'
        proxy.$refs['packet'].style.backgroundRepeat = 'no-repeat'
        proxy.$refs['packet'].style.animation = 'unset'
        setTimeout(() => {
          redEnvelopeHidden.value = false
        }, 500)
      })
    }
    const redEnvelopeShow = (obj: any) => {
      redEnvelopeOptions.value = obj
      if (redEnvelopeOptions.value.beforeShow) {
        redEnvelopeOptions.value.beforeShow()
      }
      if (obj.cover) {
        proxy.$refs['packet'].style.background = `url(${obj.cover})`
        proxy.$refs['packet'].style.backgoundSize = 'contain'
        proxy.$refs['packet'].style.backgroundRepeat = 'no-repeat'
      }
      // let clip = new Clip({
      //   duration: obj.speed || 2000,
      //   repeat: 1
      // }, {
      //   y: [-100, document.documentElement.clientHeight]
      // })
      // clip.on('update', (ev: any) => {
      //   let keyframe = ev.keyframe
      //   nextTick(() => {
      //     proxy.$refs['packet'].style.top = keyframe.y + 'px'
      //     proxy.$refs['packet'].style.left = obj.xAxis + 'px'
      //     proxy.$refs['packet'].style.transform = `rotate(` + (ev.progress * 180 * redEnvelopeRotateComputed.value) +`deg)`
      //   })
      // })
      redEnvelopeAnimation.value = new Animation()
      // redEnvelopeAnimation.addClip([clip])
    }
    const redEnvelopeStart = () => {
      redEnvelopeIsDropped.value = (Math.random() * 10) > 5 ? 1: -1
      redEnvelopeAnimation.value.start()
      redEnvelopeAnimation.value.on('complete', () => {
        if (!redEnvelopeIsDropped.value) {
          redEnvelopeOptions.value.onDropped()
          redEnvelopeIsDropped.value = true
        }
        redEnvelopeHidden.value = false
      })
    }
    return {
      redEnvelopeHidden,
      redEnvelopeAnimation,
      redEnvelopeOptions,
      redEnvelopeIsDropped,
      redEnvelopeRotateComputed,
      openRedEnvelope,
      redEnvelopeClick,
      redEnvelopeShow,
      redEnvelopeStart
    }
  }
})
</script>

<style lang="less" scoped>
.v-red-envelope-box {
  width: 0.5rem;
  height: 0.8rem;
  position: absolute;
  top: -1rem;
  background: url('../../assets/activity/red-envelope.png') no-repeat;
  background-size: contain;
  transform: rotate(0deg);
}
</style>
