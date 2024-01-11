<template>
  <div class="v-station-letter-Details">
    <div class="v-station-letter-Details-header">
      <div class="v-header-l">
        <svg-icon
          class="personal-menu"
          icon-class="user-back"
          @click="goBack"
        />
      </div>
      <div>站内信详情</div>
      <div />
    </div>
    <div class="v-station-letter-Details-main">
      <div class="main">
        <div class="main-title">{{ detail.title }}</div>
        <div class="main-info">
          <span>
            <span v-if="detail.tag_name" class="main-info-deep">{{
              detail.tag_name
            }}</span>
          </span>
          <span>{{ detail.update_time || detail.create_time }}</span>
        </div>
      </div>
      <div class="content">
        {{ detail.content }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, nextTick, onMounted } from 'vue'
import { setReadLetter } from '@/api/message.js'

export default defineComponent({
  name: 'StationLetterDetails',
  components: {
  },
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    const setReadFun = () => {
      // eslint-disable-next-line eqeqeq
      if (props.detail.status == 1) return
      setReadLetter({ ids: [props.detail.id] }).then((res: any) => {
        // console.log(res)
      })
    }

    const { proxy } :any = getCurrentInstance()

    function goBack() {
      proxy.mittBus.emit('changeShowDetail', false)
    }

    onMounted(() => {
      nextTick(() => {
        setReadFun()
      })
    })

    return { goBack }
  }
})
</script>

<style lang="less" scoped>
.v-station-letter-Details {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  .v-station-letter-Details-header {
    height: 48px;
    width: calc(100% - 30px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
  }
  &-main {
    flex-grow: 1;
    width: calc(100% - 30px);
    overflow: auto;
    .main {
      display: flex;
      flex-direction: column;
      padding: 12px 12px;
      background-color: #2d363d;
      border-radius: 8px;
      &-title {
        display: flex;
        height: 36px;
        color: #fff;
        font-size: 15px;
        font-weight: bold;
        justify-content: center;
        align-items: center;
      }
      &-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        .main-info-deep {
          padding: 5px 20px;
          border: 1px #db541f solid;
          color: #db541f;
          border-radius: 4px;
        }
        > span {
          font-size: 13px;
          font-weight: 300;
          color: #94a5b1;
        }
      }
    }
    .content {
      margin-top: 10px;
      margin-bottom: 15px;
      padding: 12px 12px;
      background-color: #2d363d;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 300;
      color: #94a5b1;
      line-height: 20px;
    }
  }
}
</style>
