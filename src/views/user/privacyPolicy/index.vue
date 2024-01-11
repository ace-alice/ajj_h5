<template>
  <div class="v-privacy-policy">
    <PubHeader v-if="!device" :right-icon="false" path="Register" />
    <div class="v-privacy-policy-main" :class="device ? 'v-privacy-policy-device' : ''">
      <p>对于保存客户资料方面，小艾竞技一向采取最谨慎的态度及工作程序作处理。我们对客户所肩负起的责任与承诺。另外，也清晰说明了我们处理客户资料的方式。 当阁下使用aijj.com时，表示您承认并接受小艾竞技隐私政策的规则与条件，并了解收集各项资料之目的及处理之方式。如果您不同意本隐私政策中的条款，请不要使用网站或将您的个人信息提供给我们。 所有用户提供的个人信息，其传送都将通过安全端口（SSL 128 bit encryption Standard）并存放在公众无法进入的保密环境之下。所有数据的内部出入都受到限制及严密的监控。</p>

      <span>信息收集与使用</span>

      <p>当客户在小艾竞技开设及使用帐户时，我们所收集的信息和数据包含姓名、位址、年龄、电邮、电话、IP地址等，而收集这些信息的目为：</p>

      1.保留户口的交易纪录

      2.协助改善户口管理

      3.安全理由(包括客户的身份证明)

      4.建立客户档案

      5.管理客户关系

      6.在您同意的情况下，为您提供我们的优惠活动、产品和服务信息

      7.为防止欺诈、不规律投注、洗黑钱和欺骗等行为而对交易进行监管

      <span>户口的交易状况</span>

      <p>为鉴别客户的兴趣以提供相关优惠及资讯，或基于交易与业务运作等安全理由，我们会保留客户的交易纪录以作分析。</p>

      <span>传送优惠资讯</span>

      <p>在注册帐号时，客户可选择是否希望收到优惠资讯。登记后，客户亦可随时透过电邮作出有关更改：(email)。请注意：当客户选择不希望收到优惠资讯时，我们会尽力地停止相关传送，并承诺于28天内完成这个步骤。</p>

      <span>更改您的个人资料</span>

      <p>客户可随时更改个人资料。如有需要，可向我们的客户服务员联络。</p>

      <span>个人资料的安全与准确性</span>

      <p>我们承诺会妥善地保存客户的所有资料，并维护相关资料的准确性。根据法律，客户有权保留个人资料及要求更改任何错误。</p>

      <p>同时，我们更会采取所有步骤以确保客户资料在处理过程中，能达至最严格的安全标准。此外，客户资料只有在适用的法律之下方有机会被透露，而资料则主要透露给小艾竞技等有关部门、商业伙伴、顾问与供应商(如 信用卡处理机构)。我们承诺不会将客户的资料售卖给第三者。</p>

      <span>电话</span>

      <p>出于员工培训和安全原因，我们所有的客户往来电话均有录音，同时也可为您之前所受到的服务提供进一步的协助。</p>

      <span>小型文字档案(Cookies)</span>

      <p>客户使用本网站后，我们出于以上目的可能使用cookies技术从服务器中收集客户信息。如果您在小艾竞技注册或者继续使用网站，则您将被视为同意我们使用Cookies。</p>

      <p>Cookies包含转至您电脑硬盘上的信息。这将帮助我们完善网站，并提供更优质且人性化的服务。我们使用的某些Cookies对于网站的运行至关重要。</p>

      <p>如果您想删除任何已储存在您电脑上的Cookies，或想停止那些记录您浏览网站模式的Cookies，您可以删除您的现有Cookies和/或更改您浏览器上的隐私设置，以阻挡Cookies（此过程在各个浏览器间有所不同）。</p>

      <p>如果您想获知更多关于如何操作的信息，请访问aijj.com。请注意，如果删除我们的Cookies或阻挡我们之后的Cookies，将导致您无法使用网站的某些区域或特色功能。</p>

      <span>网站信息</span>

      <p>我们的系统会自动记录小艾竞技浏览者的网路IP地址，但我们决不会记录网站访问者的电邮地址，而此项主要是用作网站流量统计之用。</p>

      <span>广告系统</span>

      <p>我们的广告系统会自动记录点击者的网路IP地址，此项主要令网站宣传功能有效发挥。</p>

      <span>彩金</span>

      <p>我们会严格保密客户所赢取的彩金数额。如根据当地的法律规定，要求客户必须要向当地的政府机构申报所赢取之彩金数额。那这个申报权益则会留给客户作决定。</p>

      <span>安全性</span>

      <p>小艾竞技为确保客户提供给我们的个人资讯及资料是绝对安全保密。所有传送给我们的相关内容，都必定经过高科技的保密设施后，然后储存进我们的伺服器内。这项保密设施，乃使用目前最先进的防火墙技术来维护。我们的娱乐 网站和软体更会采用最佳的保密程式，目的是保证玩家的个人资料不会被第三方使用。</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import PubHeader from '@/components/PubHeader/index.vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    PubHeader
  },
  setup() {
    const route = useRoute()
    const device = computed(() => route.query.device)
    return {
      device
    }
  }
})
</script>

<style lang="less" scoped>
.v-privacy-policy {
  &-main {
    margin: 48px 15px 20px 15px;
    font-size: 12px;
    color: #c2d2df;
    height: calc(100% - 60px);
    overflow: auto;
    padding-bottom: 20px;
    font-family: PingFang-SC;
    &-title {
      display: flex;
      justify-content: center;
    }
    p {
      text-indent: 2em;
      margin: 0;
    }
    span {
      display: flex;
      font-size: 14px;
      font-weight: bold;
      margin: 10px 0;
      color: #fff;
    }
  }
  &-device {
    margin-top: 0;
    padding-top: 10px;
    height: calc(100% - 30px);
  }
}
</style>
