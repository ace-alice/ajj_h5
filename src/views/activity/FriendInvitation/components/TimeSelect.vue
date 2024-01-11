<template>
  <div class="time-select">
    <div class="time-select-input">
      <div>注册时间 :</div>
      <div @click.stop="searchTimeChange">
        <span>{{ currentTime.start_time.join('/') }}</span><span style="margin: 0 5px">至</span><span>{{ currentTime.end_time.join('/') }}</span>
      </div>
      <div @click.stop="searchTimeChange">筛选</div>
    </div>
    <div :class="{ show: showCalendar }" class="time-select-box" @click.stop>
      <div class="time-select-box-main">
        <div class="box-1">
          <div>从</div>
          <div class="box-1-divider" />
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
          <div class="box-2-divider" />
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
      <div class="popup-main-currency">
        <span>
          交易类型
        </span>
        <div class="popup-main-currency-list popup-main-currency-type">
          <span
            v-for="type in tradeTypeList"
            :key="type.id"
            :class="currentTime.status === type.id ? 'trade-active' : ''"
            @click="tradeTypeClick(type)"
          >{{ type.label }}</span>
        </div>
      </div>
      <div class="time-select-box-footer">
        <div @click.stop="reset">重置</div>
        <div @click.stop="pickerSure">确定</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { parseTime } from '@/utils/index.js';

export default defineComponent({
  name: 'TimeSelect',
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
  emits: ['timeChange'],
  setup(props, { emit }) {
    const state = reactive({
      max_date: new Date(),
      min_date: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
      showCalendar: false,
      tradeTypeList: [
        { id: 0, label: '全部' },
        { id: 1, label: '存款未达标' },
        { id: 2, label: '待领取' },
        { id: 3, label: '已领取' },
        { id: 4, label: '已过期' }
      ]
    });

    /**
     * 交易类型点击事件
     */
    const tradeTypeClick = (row: any) => {
      if (!row) return (currentTime.status = 0);
      currentTime.status = row.id;
    };

    function getOffTime(num: number) {
      const nowTime = new Date().getTime();
      const offTime = 1000 * 60 * 60 * 24 * num;
      return parseTime(nowTime - offTime, props.timeType);
    }

    /**
     * 日期条件改变事件
     */
    const searchTimeChange = () => {
      state.showCalendar = !state.showCalendar;
    };

    const currentTime = reactive({
      start_time: getTimeArr(new Date().getTime() - 1000 * 60 * 60 * 24 * 30),
      end_time: getTimeArr(new Date()),
      status: 0
    });

    function getTimeArr(time: any) {
      const y = parseTime(time, '{y}');
      const m = parseTime(time, '{m}');
      const d = parseTime(time, '{d}');
      return [y, m, d];
    }

    function pickerOneChange(value: any) {
      const { selectedValues } = value;
      currentTime.start_time = selectedValues;
    }

    function pickerTwoChange(value: any) {
      const { selectedValues } = value;
      currentTime.end_time = selectedValues;
    }

    function pickerSure() {
      emit('timeChange', {
        [props.startKey]: currentTime.start_time.join('-'),
        [props.endKey]: currentTime.end_time.join('-'),
        status: currentTime.status
      });
      state.showCalendar = false;
    }

    function reset() {
      currentTime.start_time = getTimeArr(new Date().getTime() - 1000 * 60 * 60 * 24 * 30);
      currentTime.end_time = getTimeArr(new Date());
      currentTime.status = 0;
    }
    return {
      ...toRefs(state),
      searchTimeChange,
      getOffTime,
      currentTime,
      pickerSure,
      pickerOneChange,
      pickerTwoChange,
      reset,
      tradeTypeClick
    };
  }
});
</script>

<style scoped lang="less">
.time-select {
  position: relative;
  .time-select-input {
    width: calc(100% - 30px);
    margin: 10px auto;
    display: flex;
    align-items: center;
    font-size: 13px;
    > div {
      flex-shrink: 0;
      &:nth-child(2) {
        flex-grow: 1;
        height: 30px;
        display: flex;
        margin-left: 5px;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background-color: #2d363d;
        cursor: pointer;
      }
      &:nth-child(3) {
        width: 80px;
        text-align: center;
        font-size: 14px;
        background-image: linear-gradient(to right, #12dedf, #07c79c), linear-gradient(to bottom, #fff, #fff);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        cursor: pointer;
      }
    }
  }
  .popup-main-currency {
    width: calc(100% - 30px);
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    span {
      line-height: 30px;
      font-size: 14px;
      color: #b6c1cb;
    }
    &-list {
      display: flex;
      justify-content: space-between;
      .trade-active {
        background-image: linear-gradient(to right, #12dedf, #07c79c);
        color: #1a242c;
      }
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: calc(25% - 10px);
        height: 26px;
        border-radius: 13px;
        font-size: 12px;
        background-color: #3e4a53;
        margin: 5px 0;
      }
    }
    &-type {
      flex-flow: row wrap;
      align-content: flex-start;
    }
  }

  .time-select-box {
    background-color: #2d363d;
    position: absolute;
    top: 40px;
    left: 0;
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
}
.box-pl {
  height: 30px;
  line-height: 30px;
  margin: 10px 40px 0;
  color: #8f9fab;
  font-size: 12px;
}

.show {
  height: 290px !important;
  transition: height 0.3s ease;
  -webkit-transition: height 0.3s ease;
}
</style>
