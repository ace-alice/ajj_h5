<template>
  <div class="placard">
    <div class="placard-icon">
      <van-badge
        dot
        :content="0"
        :style="{
          '--van-badge-dot-size': '5px',
          '--van-badge-dot-color': item.status == 1 ? '#00000000' : '#e72c2c'
        }"
        :show-zero="false"
      >
        <van-image width="16" height="16" :src="item.tag_logo">
          <template #error>
            <img :src="letterDefaultImage" style="height:16px" alt="">
          </template>
          <template #loading>
            <img :src="letterDefaultImage" style="height:16px" alt="">
          </template>
        </van-image>
      </van-badge>
    </div>
    <div class="placard-content">
      <div class="placard-content-title">
        <div class="placard-content-title-t">
          {{ item.title }}
        </div>
        <div class="placard-content-title-time">
          {{
            parseTime(
              item.update_time
                ? item.update_time
                : item.create_time
                  ? item.create_time
                  : new Date(),
              '{m}-{d}'
            )
          }}
        </div>
      </div>
      <!-- <div class="placard-content-info">
        {{ item.content }}
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { parseTime } from '@/utils/index.js'
import defaultImages from '@/hooks/defaultImages'

export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  setup() {
    const { letterDefaultImage } = defaultImages()
    return { parseTime, letterDefaultImage }
  }
})
</script>

<style lang="less" scoped>
.placard {
  display: flex;
  flex-grow: 1;
  border-radius: 4px;
  background-color: #2d363d;
  color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  font-size: 14px;
  + .placard {
    margin-top: 10px;
  }
  &-icon {
    width: 50px;
    text-align: center;
    flex-shrink: 0;
  }

  &-content {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: #fff;
    font-family: PingFang-SC;
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &-title {
      display: flex;
      justify-content: space-between;
      &-t {
        flex-grow: 1;
        font-size: 14px;
        font-weight: bold;
      }
      &-time {
        width: 60px;
        text-align: center;
        font-size: 13px;
        color: #94a5b1;
      }
    }

    &-info {
      margin-top: 15px;
      font-size: 12px;
      color: #94a5b1;
      width: 100%;
      font-weight: 300;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
