<template>
  <div class="templ-container">
    <div class="tiro-task-dialog-header">
      <span>申请</span>
    </div>
    <div class="tiro-task-dialog-main">
      <van-cell-group inset>
        <van-field
          v-model="venuePayResult"
          is-link
          readonly
          name="picker"
          label="选择场馆："
          placeholder="请选择场馆"
          @click="venuePayShowPicker = true"
        />
        <van-popup v-model:show="venuePayShowPicker" teleport="#app" position="bottom">
          <van-picker :columns="venuePayColumns" @confirm="venuePayOnConfirm" @cancel="venuePayShowPicker = false" />
        </van-popup>
        <van-field
          v-model="timeResult"
          is-link
          readonly
          name="datePicker"
          label="投注时间："
          placeholder="请选择投注时间"
          @click="timeShowPicker = true"
        />
        <van-popup v-model:show="timeShowPicker" teleport="#app" position="bottom">
          <van-date-picker
            @confirm="timeOnConfirm"
            type="datetime"
            :min-date="minDate"
            :max-date="maxDate"
            @cancel="timeShowPicker = false"
          />
        </van-popup>
        <van-field v-model="orderId" name="注单号码" label="注单号码：" placeholder="请输入对应赛事的注单号码" />
      </van-cell-group>
      <!--          </van-form>-->
    </div>
    <div class="tiro-task-dialog-footer">
      <span @click.stop="close">取消</span>
      <span v-if="venuePayButtonDialogType" @click.stop="venuePayOnSubmit">确定</span>
      <span v-else>确定</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, reactive } from 'vue';
import { Toast } from 'vant';
import { parseTime } from '@/utils/index.js';
import activityPageHook from '@/hooks/activityPage';
export default defineComponent({
  name: 'BonusApplication',
  setup(props, ctx) {
    const { request } = activityPageHook();
    const venuePayColumns = [
      {
        value: 1,
        text: '小艾电竞'
      },
      {
        value: 4,
        text: '小艾体育'
      },
      {
        value: 3,
        text: '平博体育'
      },
      {
        value: 2,
        text: '沙巴体育'
      }
    ];
    const venuePayOnConfirm = (values: any) => {
      venuePayShowPicker.value = false;
      venuePayResult.value = values.selectedOptions[0].text;
      venuePayId.value = values.selectedOptions[0].value;
      // fieldValue.value = selectedOptions[0].text
    };
    const timeOnConfirm = (values: any) => {
      console.log('timeOnConfirm', values);
      timeResult.value = formatter(values.selectedValues.join('/'));
      timeShowPicker.value = false;
    };
    const formatter = (time: any) => {
      const newDate = time == null ? new Date() : new Date(time);
      const year = newDate.getFullYear();
      const month = newDate.getMonth() + 1;
      const date = newDate.getDate();
      let newTime = year + '-';
      if (month < 10) {
        newTime += '0';
      }
      newTime += month + '-';
      if (date < 10) {
        newTime += '0';
      }
      newTime += date;

      return newTime;
    };

    const venuePayShowPicker = ref(false);

    const venuePayResult = ref('');

    const venuePayId = ref('');

    const timeResult = ref('');

    const timeShowPicker = ref(false);

    const orderId = ref('');

    const venuePayButtonDialogType = ref(true);
    
    const close = () => {
      ctx.emit('close');
    };
    const venuePayOnSubmit = () => {
      // if (!token.value) return;
      // if (!currentGameId.value) {
      //   return Toast.fail('赛事ID不能为空')
      // }
      if (!venuePayId.value) {
        return Toast.fail('场馆不能为空');
      }
      if (!timeResult.value) {
        return Toast.fail('投注时间不能为空');
      }
      if (!orderId.value) {
        return Toast.fail('注单号不能为空');
      }
      if (venuePayButtonDialogType.value) {
        venuePayButtonDialogType.value = false;
        const params = {
          venue_id: venuePayId.value,
          bet_time: parseTime(timeResult.value, '{y}-{m}-{d}'),
          order_id: orderId.value
        };
        request
          .value({
            url: '/index/Activity/s12BattleChosenApply',
            method: 'post',
            data: params
          })
          .then((res: any) => {
            if (+res.code === 1) {
              Toast.success('申请成功');
              setTimeout(() => {
                close();
              }, 1000);
            }
            venuePayButtonDialogType.value = true;
          })
          .catch((err: any) => {
            Toast.fail(err.msg || err.message);
            venuePayButtonDialogType.value = true;
          });
      }
    };
    return {
      venuePayShowPicker,
      venuePayResult,
      venuePayId,
      timeResult,
      timeShowPicker,
      venuePayColumns,
      venuePayOnConfirm,
      timeOnConfirm,
      orderId,
      venuePayButtonDialogType,
      venuePayOnSubmit,
      close,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1)
    };
  }
});
</script>
<style lang="less" scoped>
:deep .van-picker__toolbar {
  background-color: #3e4a53;
}
:deep .van-picker__toolbar {
  background-color: #3e4a53;
}
:deep .van-picker__cancel {
  font-size: 14px;
  color: #b6c1cb;
}
:deep .van-picker__title {
  font-size: 15px;
  color: #fff;
}

:deep .van-picker__confirm {
  background-image: linear-gradient(to right, #12dedf, #07c79c), linear-gradient(to bottom, #b6c1cb, #b6c1cb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
:deep .van-picker__columns {
  background-color: #2d363d;
}
:deep .van-picker__mask {
  background-image: linear-gradient(180deg, rgba(45, 54, 61, 0.9), rgba(45, 54, 61, 0.4)),
    linear-gradient(0deg, rgba(45, 54, 61, 0.9), rgba(45, 54, 61, 0.4));
}
:deep .van-picker-column__item {
  color: #94a5b1;
  font-size: 12px;
}
:deep .van-picker-column__item--selected {
  font-size: 12px;
  color: #fefefe;
}
:deep .van-picker__frame {
  left: 0;
  right: 0;
}
:deep .van-hairline-unset--top-bottom::after {
  border-color: #54636f;
}
.tiro-task-dialog {
  :deep(.van-popup) {
    width: 80%;
    border-radius: 5px;
    background-color: #2d363d;
  }
  &-header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
    background-color: #3e4a53;
    color: #fff;
    font-size: 14px;
  }
  &-main {
    display: flex;
    align-items: center;
    padding: 20px 0;
    :deep(.van-cell-group) {
      background: transparent;
    }
    :deep(.van-cell) {
      background: transparent;
      font-size: 12px;
      &:after {
        border-bottom: 0 !important;
      }
    }
    :deep(.van-field__label) {
      display: flex;
      height: 26px;
      line-height: 26px;
      color: #fff;
      width: 70px;
    }
    :deep(.van-cell__value) {
      height: 26px;
      line-height: 26px;
      color: #fff;
    }
    :deep(.van-field__control) {
      height: 26px;
      line-height: 26px;
      color: #fff;
    }
    ::placeholder {
      font-size: 12px;
      height: 26px;
      line-height: 26px;
    }
  }
  &-footer {
    display: flex;
    height: 40px;
    span {
      display: flex;
      flex: 1 0 50%;
      align-items: center;
      justify-content: center;
    }
    span:nth-child(1) {
      background-color: #3e4a53;
      color: #94a5b1;
      font-size: 14px;
    }
    span:nth-child(2) {
      background-image: linear-gradient(to right, #12dedf, #07c79c);
      font-size: 14px;
      color: #1a242c;
    }
  }
}
</style>
