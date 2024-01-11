<template>
  <div class="search-tabs">
    <span
      v-for="item in searchTimeList"
      :key="item.id"
      :class="item.id == timeActive ? 'time-active' : ''"
      @click="searchTimeChange(item)"
    >
      {{ item.label }}
    </span>
    <teleport to="#app">
      <div
        v-show="showCalendar"
        @click="showCalendar = false"
        class="time-select-box-bg"
      ></div>
    </teleport>
    <div :class="{ show: showCalendar }" class="time-select-box" @click.stop>
      <div class="time-select-box-main">
        <div class="box-1">
          <div>从</div>
          <div class="box-1-divider"></div>
          <div>到</div>
        </div>
        <div class="box-2">
          <van-date-picker
            v-model="currentTime.start_time"
            title="选择时间"
            :columns-type="columnsType"
            :visible-option-num="2"
            :show-toolbar="false"
            :option-height="26"
            :max-date="max_date"
            :min-date="min_date"
            @change="pickerOneChange"
          />
          <div class="box-2-divider"></div>
          <van-date-picker
            v-model="currentTime.end_time"
            title="选择时间"
            :columns-type="columnsType"
            :visible-option-num="2"
            :show-toolbar="false"
            :option-height="26"
            :max-date="max_date"
            :min-date="min_date"
            @change="pickerTwoChange"
          />
        </div>
      </div>
      <div class="box-pl">
        当前支持查询最近30天记录
      </div>
      <div class="time-select-box-footer">
        <div @click.stop="reset">重置</div>
        <div @click.stop="pickerSure">确定</div>
      </div>
    </div>
  </div>
  <!-- <van-calendar
    v-model:show="showCalendar"
    :min-date="new Date(getOffTime(100))"
    :max-date="new Date()"
    color="#07c79c"
    type="range"
    @confirm="onConfirm"
    :style="{
      '--van-calendar-background': '#3e4a53',
      '--van-text-color': '#fff',
      color: '#fff'
    }"
  /> -->
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { parseTime } from '@/utils/index.js'

export default defineComponent({
  emits: ['timeChange'],
  props: {
    timeType: {
      type: String,
      default: '{y}-{m}-{d}'
    },
    startKey: {
      type: String,
      default: 'start_time'
    },
    endKey: {
      type: String,
      default: 'end_time'
    },
    columnsType: {
      type: Array,
      default: () => ['year', 'month', 'day']
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      /**
       * 日期条件列表
       */
      searchTimeList: [
        {
          id: 1,
          label: '今天'
        },
        {
          id: 2,
          label: '近3日'
        },
        {
          id: 3,
          label: '近7日'
        },
        {
          id: 4,
          label: '近30日'
        },
        {
          id: 5,
          label: '自定义'
        }
      ],
      /**
       * 日期条件默认选中
       */
      timeActive: 1,
      max_date: new Date(),
      min_date: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
      showCalendar: false
    })

    function getOffTime(num: number) {
      const nowTime = new Date().getTime()
      const offTime = 1000 * 60 * 60 * 24 * num
      return parseTime(nowTime - offTime, props.timeType)
    }

    /**
     * 日期条件改变事件
     */
    const searchTimeChange = (row: any) => {
      if (row.id == 5) return (state.showCalendar = true)
      state.timeActive = row.id

      switch (state.timeActive) {
        case 1:
          emit('timeChange', {
            [props.startKey]: getOffTime(0),
            [props.endKey]: getOffTime(0)
          })
          break
        case 2:
          emit('timeChange', {
            [props.startKey]: getOffTime(2),
            [props.endKey]: getOffTime(0)
          })
          break
        case 3:
          emit('timeChange', {
            [props.startKey]: getOffTime(6),
            [props.endKey]: getOffTime(0)
          })
          break
        case 4:
          emit('timeChange', {
            [props.startKey]: getOffTime(29),
            [props.endKey]: getOffTime(0)
          })
          break
        case 5:
          state.showCalendar = true
          break
      }
    }

    const currentTime = reactive({
      start_time: getTimeArr(new Date()),
      end_time: getTimeArr(new Date())
    })

    function getTimeArr(time: any) {
      const y = parseTime(time, '{y}')
      const m = parseTime(time, '{m}')
      const d = parseTime(time, '{d}')
      return [y, m, d]
    }

    function onConfirm(value: any) {
      emit('timeChange', {
        [props.startKey]: parseTime(value[0], props.timeType),
        [props.endKey]: parseTime(value[1], props.timeType)
      })
      state.showCalendar = false
    }

    function pickerOneChange(value: any) {
      const { selectedValues } = value
      currentTime.start_time = selectedValues
    }

    function pickerTwoChange(value: any) {
      const { selectedValues } = value
      currentTime.end_time = selectedValues
    }

    function pickerSure() {
      emit('timeChange', {
        [props.startKey]: currentTime.start_time.join('-'),
        [props.endKey]: currentTime.end_time.join('-')
      })
      state.timeActive = 5
      state.showCalendar = false
    }

    function reset() {
      currentTime.start_time = getTimeArr(new Date())
      currentTime.end_time = getTimeArr(new Date())
    }
    return {
      ...toRefs(state),
      searchTimeChange,
      onConfirm,
      getOffTime,
      currentTime,
      pickerSure,
      pickerOneChange,
      pickerTwoChange,
      reset
    }
  }
})
</script>

<style lang="less" scoped>
.search-tabs {
  display: flex;
  align-items: center;
  height: 28px;
  // border-radius: 14px;
  // background-color: #3e4a53;
  color: #fff;
  font-size: 14px;
  padding: 0 10px;
  position: relative;
  span {
    margin: 0 10px;
  }
  .time-active {
    background-image: linear-gradient(to right, #12dedf, #07c79c),
      linear-gradient(to bottom, #fff, #fff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.time-select-box-bg {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 2009;
  background-color: #00000030;
}
.time-select-box {
  background-color: #2d363d;
  position: absolute;
  top: 40px;
  left: -15px;
  width: 100vw;
  height: 0px;
  z-index: 3000;
  overflow: hidden;
  border-end-end-radius: 8px;
  border-end-start-radius: 8px;
  transition: height 0.3s ease;
  -webkit-transition: height 0.3s ease;

  .time-select-box-main {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 15px;
    .box-1 {
      width: 20%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      font-size: 14px;
      font-family: PingFang-SC;
      .box-1-divider {
        height: 46px;
        width: 1px;
        background-color: #8f9fab;
        margin: 10px 0;
      }
    }
    .box-2 {
      width: 70%;
      .box-2-divider {
        height: 1px;
        background-color: #8f9fab;
        margin: 10px 0;
      }
      --van-picker-mask-color: linear-gradient(180deg, #2d363d90, #2d363d40),
        linear-gradient(0deg, #2d363d90, #2d363d40);
      :deep(.van-picker) {
        background: none;
        .van-picker-column__item {
          color: #8f9fab;
          // height: 33px !important;
        }
        .van-picker-column__item--selected {
          color: #fff;
        }

        [class*='van-hairline']::after {
          display: none;
        }
      }
    }
  }
  .time-select-box-footer {
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100vw;
    display: flex;
    justify-content: space-between;
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50%;
      height: 40px;
      background-color: #3e4a53;
    }
    div:nth-child(2) {
      background-image: linear-gradient(to right, #12dedf, #07c79c);
      color: #000;
    }
  }
}

.box-pl {
  height: 30px;
  line-height: 30px;
  margin: 10px 40px 0;
  color: #8f9fab;
  font-size: 12px;
}

.show {
  height: 220px;
  transition: height 0.3s ease;
  -webkit-transition: height 0.3s ease;
}
</style>
