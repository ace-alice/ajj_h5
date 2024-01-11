<template>
  <div class="placard">
    <div class="placard-icon">
      <van-image width="16" height="16" :src="item.tag_logo">
        <template #error>
          <img
            :src="announcementDefaultImage"
            style="width:16px;height:16px"
            alt=""
          >
        </template>
        <template #loading>
          <img
            :src="announcementDefaultImage"
            style="width:16px;height:16px"
            alt=""
          >
        </template>
      </van-image>
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
      <div class="placard-content-info">
        {{ item.content }}
      </div>
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
    const { announcementDefaultImage } = defaultImages()
    return { parseTime, announcementDefaultImage }
  }
})
</script>

<style lang="less" scoped>
.placard {
  display: flex;
  width: 100%;
  border-radius: 4px;
  background-color: #2d363d;
  color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 13px 0;
  + .placard {
    margin-top: 10px;
  }
  &-icon {
    width: 46px;
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
      align-items: center;
      &-t {
        flex-grow: 1;
        font-size: 15px;
        font-weight: bold;
        max-width: 60%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &-time {
        // width: 60px;
        margin-right: 15px;
        text-align: center;
        font-size: 12px;
        color: #94a5b1;
      }
    }

    &-info {
      margin-top: 15px;
      font-size: 14px;
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
