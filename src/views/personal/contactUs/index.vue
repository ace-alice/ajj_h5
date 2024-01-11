<template>
  <div class="v-setting-about-contactUs">
    <PubHeader :right-icon="false" />
    <div class="v-setting-about-contactUs-main">
      <div class="contactUs-main-button" @click.stop="toPath">
        <span>24小时客服</span>
      </div>
      <van-cell-group inset>
        <van-cell
          v-for="contact in contactList"
          :key="contact.id"
          :value="contact.address"
        >
          <template #title>
            <span class="custom-title">{{
              getLabel(String(contact.identity))
            }}</span>
          </template>
          <template #right-icon>
            <svg-icon
              icon-class="personal-copy"
              @click="copy(contact.address)"
            />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import useClipboard from 'vue-clipboard3'
import PubHeader from '@/components/PubHeader/index.vue'
import { Toast } from 'vant'
import { getContactUs } from '@/api/contactUs.js'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ContactUs',
  components: {
    PubHeader
  },
  setup() {
    const { toClipboard } = useClipboard()
    const state = reactive({
      emailText: 'iasport@gmail.com'
    })
    /**
     * 复制功能
     * @param msg
     */
    const copy = async(msg: any) => {
      try {
        await toClipboard(msg)
        Toast.success({
          message: '复制成功',
          duration: 1500
        })
      } catch (e) {
        // console.log(e)
        Toast.fail(e)
      }
    }

    function getLabel(identity: string) {
      if (identity === '2') {
        return '商务接洽'
      }
      if (identity === '3') {
        return '意见反馈'
      }
    }

    const contactList: any = ref([])

    const router = useRouter()

    function toPath() {
      router.push({ name: 'OnlineService' })
    }

    function getContactUsFun() {
      getContactUs().then((res: any) => {
        contactList.value = []
        if (Number(res.code) === 1) {
          for (const i in res.data) {
            if (res.data[i].identity === 2 || res.data[i].identity === 3) {
              contactList.value.push(res.data[i])
            }
          }
        }
      })
    }

    onMounted(() => {
      getContactUsFun()
    })

    return {
      ...toRefs(state),
      copy,
      contactList,
      toPath,
      getLabel
    }
  }
})
</script>

<style lang="less" scoped>
.v-setting-about-contactUs {
  background-image: url('../../../assets/personal/contact-us-bg.webp');
  background-size: 100%;
  background-repeat: no-repeat;
  &-main {
    margin-top: 48px;
    .contactUs-main-button {
      display: flex;
      span {
        display: flex;
        justify-content: center;
        margin: 100px 0 20px 15px;
        width: 90px;
        height: 34px;
        line-height: 34px;
        border: solid 1px #0dd4c2;
        border-radius: 17px;
        font-size: 12px;
        background: rgba(45, 54, 61, 0.5);
        color: #fff;
      }
    }
    :deep(.van-cell-group--inset) {
      margin: 0 15px 25px 15px;
    }
    :deep(.van-cell) {
      background-color: #2d363d;
      color: #fff;
      height: 50px;
      margin-bottom: 5px;
      border-radius: 4px;
      font-weight: 300;
      font-size: 12px;
      align-items: center;
      .van-cell__value {
        overflow: hidden;
        text-overflow: ellipsis;
        color: #94a5b1;
        span {
          width: 100%;
          white-space: nowrap;
        }
      }
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
    :deep(.svg-icon) {
      margin-left: 10px;
    }
  }
  :deep(.van-popup) {
    background: #1c2227;
  }
  .contact-box {
    height: 100%;
    .contact-box-header {
      height: 48px;
      width: calc(100% - 30px);
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      font-size: 18px;
      span {
        font-size: 14px;
        font-weight: 600;
      }
    }
    .contact-box-main {
      height: calc(100% - 48px);
      overflow: auto;
    }
  }
}
.rotate {
  animation: rotate360 2s linear;
}
@keyframes rotate360 {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
