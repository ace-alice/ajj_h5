<template>
  <div class="v-agent-list-item">
    <div class="v-agent-list-item-data">
      <div
        v-for="sort in dateTypeList"
        :key="sort.code"
        class="v-filter-body-sort-item"
        :class="{ 'v-item-active': sort.code === date_type }"
        @click.stop="changeSort('date_type', sort.code)"
      >
        {{ sort.label }}
      </div>
    </div>
    <div class="v-agent-list-item-title">
      <div class="v-agent-list-item-title-left">
        <svg-icon icon-class="agent-avatar" class="icon-class" />
        <span>{{ query.username }}</span>
      </div>
      <div>
        <span class="v-agent-list-item-title-bottom">
          <!-- <span>2022-5-25</span>
          <van-icon name="calendar-o" class="icon" /> -->
        </span>
      </div>
    </div>
    <div class="v-agent-list-item-body">
      <GlobalLoad v-show="loading" />
      <div class="v-agent-list-item-body-top">
        <div>
          <div>投注金额：</div>
          <div>{{ priceToFixed(item.total_bet) }}</div>
        </div>
        <div>
          <div>有效投注：</div>
          <div>{{ priceToFixed(item.total_valid_bet) }}</div>
        </div>
      </div>
      <div class="divider" />
      <div class="v-agent-list-item-body-top">
        <div>
          <div>游戏盈亏：</div>
          <div :class="{ 'text-red': true, 'text-green': false }">
            {{ priceToFixed(item.total_game_profit) }}
          </div>
        </div>
        <div>
          <div>返水金额：</div>
          <div>{{ priceToFixed(item.total_rebate) }}</div>
        </div>
        <div>
          <div>优惠金额：</div>
          <div>{{ priceToFixed(item.total_discount) }}</div>
        </div>
        <div>
          <div>总盈亏：</div>
          <div>{{ priceToFixed(item.total_profit) }}</div>
        </div>
      </div>
      <div class="divider" />
      <div class="v-agent-list-item-body-bottom">
        <div>
          总盈亏=游戏盈亏+总返水+总优惠
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import toPathHook from '@/hooks/toPath';
import { defineComponent, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
import { getUserReportDetail } from '@/api/agent.js';
import GlobalLoad from '@/components/Loading/index.vue';
import { priceToFixed } from '@/utils/index.js';

export default defineComponent({
  name: 'UserReportDetailItem',
  components: { GlobalLoad },
  setup() {
    const { toPath, query } = toPathHook();

    const item = ref({});

    const formData: any = reactive({
      username: null,
      date_type: 1
    });

    const loading = ref(true);

    function getUserReportDetailFun() {
      loading.value = true;
      getUserReportDetail(formData)
        .then((res: any) => {
          // eslint-disable-next-line eqeqeq
          if (res.code == 1) {
            item.value = res.data;
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }

    const dateTypeList = [
      { label: '昨天', code: 1 },
      { label: '前天', code: 2 },
      { label: getMountNumber(), code: 3 },
      { label: getMountNumber(1), code: 4 },
      { label: getMountNumber(2), code: 5 }
    ];

    function getMountNumber(offset: number = 0) {
      const now = new Date();
      const CM = now.getMonth();
      const rm = CM - offset + 1;
      if (rm < 1) {
        return rm + 12 + '月';
      } else {
        return rm + '月';
      }
    }

    function changeSort(keyL: string, code: number) {
      formData[keyL] = code;
      getUserReportDetailFun();
    }

    onMounted(() => {
      nextTick(() => {
        Object.assign(formData, query.value);
        getUserReportDetailFun();
      });
    });

    return {
      toPath,
      query,
      item,
      ...toRefs(formData),
      loading,
      dateTypeList,
      changeSort,
      priceToFixed
    };
  }
});
</script>

<style lang="less" scoped>
.icon-class {
  font-size: 16px;
  font-weight: bold;
  margin: 0 15px;
}
.v-agent-list-item {
  border-radius: 8px;
  flex-shrink: 0;
  width: 100%;
  margin-top: 40px;
  position: relative;
  .v-agent-list-item-data {
    position: absolute;
    width: 100%;
    height: 36px;
    top: -36px;
    color: #fff;
    display: flex;
    font-size: 14px;
    .v-filter-body-sort-item {
      padding: 0 15px 0 10px;
    }
    .v-item-active {
      background-image: linear-gradient(to right, #12dedf, #07c79c), linear-gradient(to bottom, #fff, #fff);
      font-family: PingFang-SC, serif;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  + .v-agent-list-item {
    margin-top: 10px;
  }
  .v-agent-list-item-title {
    height: 40px;
    width: 100%;
    background-color: #45515b;
    display: flex;
    align-items: center;
    color: #fff;
    justify-content: space-between;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    .v-agent-list-item-title-bottom {
      font-size: 12px;
      margin-right: 15px;
      color: #bbc6cf;
      font-family: PingFang-SC, serif;
      .icon {
        font-size: 14px;
        margin-left: 10px;
      }
    }

    .v-agent-list-item-title-left {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 14px;
      .van-icon-user {
        font-size: 24px;
        margin: 0 15px;
      }
    }
  }
  .v-agent-list-item-body {
    width: 100%;
    background-color: #2d363d;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-size: 12px;
    color: #bbc6cf;
    flex-wrap: wrap;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;

    div {
      flex-shrink: 0;
    }
    .v-agent-list-item-body-top {
      width: 100%;

      > div {
        width: calc(100% - 40px);
        text-align: center;
        display: flex;
        justify-content: space-between;
        margin: 10px auto;
      }
      .v-to-detail {
        color: #0ed5c6;
        cursor: pointer;
      }
      .count {
        font-weight: bold;
        color: #fff;
      }
    }
  }
  .v-agent-list-item-body-bottom {
    width: 100%;
    color: #e9a20b;
    font-family: PingFang-SC, serif;
    padding-bottom: 10px;
    > div {
      width: calc(100% - 40px);
      margin: 20px auto;
      white-space: pre-wrap;
    }
  }
  .divider {
    width: calc(100% - 40px);
    margin-top: 5px;
    height: 1px;
    background-color: #45515b;
    border-radius: 0.5px;
    margin-bottom: 5px;
  }
}
.text-red {
  color: #ef0f0f;
}
.text-green {
  color: #2d363d;
}
:deep(.van-popup) {
  background: none;
}

.table-tr {
  display: flex;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
  height: 40px;
  font-size: 12px;
  margin: 0 auto;
  div {
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    height: 100%;
    line-height: 40px;
  }
  :nth-child(1) {
    width: 25%;
  }
  :nth-child(2) {
    flex-grow: 1;
  }
  :nth-child(3) {
    width: 20%;
  }
  :nth-child(4) {
    width: 20%;
  }
}

.v-detail {
  width: 80vw;
  border-radius: 8px;
  background-color: #2d363d;
  overflow: hidden;
  .v-detail-title {
    color: #fff;
    padding: 20px;
    text-align: center;
  }
  .v-detail-body {
    color: #fff;
    text-align: center;
    width: calc(100% - 40px);
    margin: auto;
    border-start-end-radius: 8px;
    border-start-start-radius: 8px;
    overflow: hidden;
    border: 0.5px solid #3e4a53;
    .v-detail-body-title {
      .table-tr();
      background-color: #3e4a53;
    }
    .v-detail-body-main {
      .table-tr();
      color: #bbc6cf;
      > div {
        border: 0.5px solid #3e4a53;
      }
    }
  }
  .v-detail-footer {
    height: 40px;
    margin: 15px auto;
    line-height: 40px;
    text-align: center;
    color: #1b1818;
    font-size: 12px;
    background-image: linear-gradient(to right, #12dedf, #07c79c);
    border-radius: 8px;
    width: 120px;
  }
}
</style>
