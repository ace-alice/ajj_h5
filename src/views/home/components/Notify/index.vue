<template>
  <div class="v-notify">
    <van-notice-bar
      color="#94a5b1"
      background="#2d363d"
      left-icon="volume-o"
      :scrollable="false"
    >
      <van-swipe
        vertical
        class="notice-swipe"
        :autoplay="3000"
        :show-indicators="false"
      >
        <van-swipe-item
          v-for="(item, index) in messageList"
          :key="index"
          @click="openNotifyDialog(item)"
        >
          {{ item }}
        </van-swipe-item>
      </van-swipe>
    </van-notice-bar>
    <van-dialog
      v-model:show="notifyShow"
      title="公告"
      :close-on-click-overlay="true"
      :show-cancel-button="false"
      :show-confirm-button="false"
    >
      <span class="notify-content">{{ notifyText }}</span>
      <div class="notify-more">
        <span @click="goPath('Bulletin')">查看更多公告 ></span>
      </div>
      <div class="notify-button">
        <span @click="notifyShow = false">我知道了</span>
      </div>
    </van-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { getAnnouncement } from '@/api/message.js'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const notifyShow = ref(false)
    const messageList: any = ref([])
    const notifyText = ref('')
    const getMessageList = async() => {
      const data = await getAnnouncement({ terminal_id: '2' })
      if (Number(data.code) === 1) {
        const arr = data.data.data
        for (const i in arr) {
          const text = arr[i].content
          messageList.value.push(text)
        }
      }
    }
    const openNotifyDialog = (row: any) => {
      notifyText.value = row
      notifyShow.value = true
    }
    const goPath = (row: any) => {
      notifyShow.value = false
      router.push({ name: row, query: { name: 'bulletin-list' } })
    }
    onMounted(() => {
      getMessageList()
    })
    return {
      notifyShow,
      messageList,
      notifyText,
      goPath,
      openNotifyDialog,
      getMessageList
    }
  }
})
</script>

<style lang="less" scoped>
.v-notify {
  margin: 6px 15px;
  border-radius: 8px;
  overflow: hidden;
  :deep(.van-notice-bar) {
    height: 30px;
    font-size: 12px;
  }
  :deep(.van-icon) {
    color: #12dedf;
  }
  :deep(.notice-swipe) {
    height: 30px;
    line-height: 30px;
  }
  :deep(.van-notice-bar__content) {
    width: 100%;
  }
  :deep(.van-dialog) {
    background: transparent;
    border-radius: 8px;
  }
  :deep(.van-dialog__header) {
    height: 40px;
    line-height: 40px;
    background-color: #3e4a53;
    padding: 0;
    font-size: 14px;
    color: #fff;
  }
  :deep(.van-dialog__content) {
    background-color: #2d363d;
    padding: 10px 10px;
    height: 200px;
    font-size: 12px;
    color: #94a5b1;
  }
  .notify-content {
    display: flex;
    height: 120px;
    overflow: hidden;
  }
  .notify-more {
    display: flex;
    justify-content: center;
    height: 30px;
  }
  .notify-button {
    display: flex;
    justify-content: center;
    span {
      display: flex;
      width: 110px;
      height: 40px;
      line-height: 40px;
      justify-content: center;
      border-radius: 8px;
      background-image: linear-gradient(to right, #12dedf, #07c79c);
      font-family: PingFang-SC;
      font-size: 14px;
      color: #1a242c;
    }
  }
}
</style>
