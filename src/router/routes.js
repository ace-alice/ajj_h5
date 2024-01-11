import Layout from '@/layout';

const routes = [
  {
    path: '/',
    name: 'root',
    component: Layout,
    redirect: 'home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          noCache: false,
          index: 1,
          showFooter: true,
          unLogin: true
        }
      },
      {
        path: 'personal',
        name: 'Personal',
        component: () => import('@/views/personal/index.vue'),
        meta: {
          title: '个人中心',
          noCache: false,
          index: 1,
          showFooter: true,
          unLogin: true
        }
      },
      {
        path: 'promotions',
        name: 'Promotions',
        component: () => import('@/views/promotions/index.vue'),
        meta: {
          title: '优惠活动',
          noCache: false,
          index: 1,
          showFooter: true,
          unLogin: true
        }
      },
      {
        path: 'wallet',
        name: 'Wallet',
        component: () => import('@/views/personal/information/index.vue'),
        meta: {
          title: '钱包',
          noCache: false,
          index: 1,
          showFooter: true
        }
      },
      {
        path: 'dAndWRecords',
        name: 'DAndWRecords',
        component: () => import('@/views/personal/dAndWRecords/index.vue'),
        meta: {
          title: '存取款记录',
          noCache: true,
          index: 2
        }
      },
      {
        path: 'activities',
        name: 'Activities',
        component: () => import('@/views/personal/activities/index.vue'),
        meta: {
          title: '我的活动',
          noCache: true,
          index: 2
        }
      },
      {
        path: 'dAndWRecordsDetails',
        name: 'DAndWRecordsDetails',
        component: () => import('@/views/personal/dAndWRecords/dAndWRecordsDetails/index.vue'),
        meta: {
          title: '存取款详情',
          noCache: true,
          index: 3
        }
      },
      {
        path: 'transactionRecord',
        name: 'TransactionRecord',
        component: () => import('@/views/personal/transactionRecord/index.vue'),
        meta: {
          title: '交易记录',
          noCache: true,
          index: 2
        }
      },
      {
        path: 'vipClub',
        name: 'VipClub',
        component: () => import('@/views/personal/vipClub/index.vue'),
        meta: {
          title: 'vip俱乐部',
          noCache: true,
          index: 2
        }
      },
      {
        path: 'bettingRecord',
        name: 'BettingRecord',
        component: () => import('@/views/personal/bettingRecord/index.vue'),
        meta: {
          title: '投注列表',
          noCache: false,
          index: 2
        }
      },
      {
        path: 'guessDetails',
        name: 'GuessDetails',
        component: () => import('@/views/personal/bettingRecord/guessDetails/index.vue'),
        meta: {
          title: '竞猜详情',
          noCache: true,
          index: 3
        }
      },
      {
        path: 'accountReceivable',
        name: 'AccountReceivable',
        component: () => import('@/views/personal/accountReceivable/index.vue'),
        meta: {
          title: '收款账户管理',
          noCache: true,
          index: 2
        }
      },
      {
        path: 'addBankCard',
        name: 'AddBankCard',
        component: () => import('@/views/personal/accountReceivable/addBankCard/index.vue'),
        meta: {
          title: '添加银行卡账户',
          noCache: true,
          index: 5
        }
      },
      {
        path: 'addUsdtCard',
        name: 'AddUsdtCard',
        component: () => import('@/views/personal/accountReceivable/addUsdtCard/index.vue'),
        meta: {
          title: '添加虚拟币账户',
          noCache: true,
          index: 5
        }
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/views/personal/setting/index.vue'),
        meta: {
          title: '设置',
          noCache: true,
          index: 2
        }
      },
      {
        path: 'transactionPassword',
        name: 'TransactionPassword',
        component: () => import('@/views/personal/setting/transactionPassword/index.vue'),
        meta: {
          title: '',
          noCache: true,
          index: 5
        }
      },
      {
        path: 'accountPassword',
        name: 'AccountPassword',
        component: () => import('@/views/personal/setting/accountPassword/index.vue'),
        meta: {
          title: '修改账户密码',
          noCache: true,
          index: 3
        }
      },
      {
        path: 'chooseLanguage',
        name: 'ChooseLanguage',
        component: () => import('@/views/personal/setting/chooseLanguage/index.vue'),
        meta: {
          title: '选择语言',
          noCache: true,
          index: 3
        }
      },
      {
        path: 'personalInfo',
        name: 'PersonalInfo',
        component: () => import('@/views/personal/setting/personalInfo/index.vue'),
        meta: {
          title: '个人资料',
          noCache: true,
          index: 3
        }
      },
      {
        path: 'editNickname',
        name: 'EditNickname',
        component: () => import('@/views/personal/setting/personalInfo/editNickname/index.vue'),
        meta: {
          title: '修改用户名',
          noCache: true,
          index: 4
        }
      },
      {
        path: 'editBirthday',
        name: 'EditBirthday',
        component: () => import('@/views/personal/setting/personalInfo/editBirthday/index.vue'),
        meta: {
          title: '编辑生日',
          noCache: true,
          index: 4
        }
      },
      {
        path: 'editAvatar',
        name: 'EditAvatar',
        component: () => import('@/views/personal/setting/personalInfo/editAvatar/index.vue'),
        meta: {
          title: '修改头像',
          noCache: true,
          index: 4
        }
      },
      {
        path: 'editPhone',
        name: 'EditPhone',
        component: () => import('@/views/personal/setting/personalInfo/editPhone/index.vue'),
        meta: {
          title: '手机号',
          noCache: true,
          index: 4
        }
      },
      {
        path: 'accountSecurity',
        name: 'AccountSecurity',
        component: () => import('@/views/personal/setting/accountSecurity/index.vue'),
        meta: {
          title: '账号安全',
          noCache: true,
          index: 3
        }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/personal/setting/about/index.vue'),
        meta: {
          title: '关于',
          noCache: true,
          index: 3
        }
      },
      {
        path: 'contactUs',
        name: 'ContactUs',
        component: () => import('@/views/personal/contactUs/index.vue'),
        meta: {
          title: '联系我们',
          noCache: false,
          unLogin: true,
          index: 4
        }
      },
      {
        path: 'onlineService',
        name: 'OnlineService',
        component: () => import('@/views/personal/onlineService/index.vue'),
        meta: {
          title: '24H客服',
          noCache: true,
          unLogin: true,
          index: 4
        }
      },
      {
        path: 'bulletin',
        name: 'Bulletin',
        component: () => import('@/views/bulletin/index.vue'),
        meta: {
          title: '消息中心',
          noCache: true,
          index: 2,
          unLogin: true
        }
      },
      {
        path: 'bulletinDetails',
        name: 'BulletinDetails',
        component: () => import('@/views/bulletin/bulletinDetails/index.vue'),
        meta: {
          title: '公告详情',
          noCache: true,
          index: 3,
          unLogin: true
        }
      },
      {
        path: 'stationLetterDetails',
        name: 'StationLetterDetails',
        component: () => import('@/views/bulletin/stationLetterDetails/index.vue'),
        meta: {
          title: '站内信详情',
          noCache: true,
          index: 3
        }
      },
      {
        path: 'recharge',
        name: 'Recharge',
        component: () => import('@/views/personal/information/recharge/index.vue'),
        meta: {
          title: '存款',
          noCache: false,
          index: 3
        }
      },
      {
        path: 'rechargeResult',
        name: 'RechargeResult',
        component: () => import('@/views/personal/information/recharge/rechargeResult/index.vue'),
        meta: {
          title: '',
          noCache: true,
          index: 4
        }
      },
      {
        path: 'withdraw',
        name: 'Withdraw',
        component: () => import('@/views/personal/information/withdraw/index.vue'),
        meta: {
          title: '取款',
          noCache: true,
          index: 3
        }
      },
      {
        path: 'transfer',
        name: 'Transfer',
        component: () => import('@/views/personal/information/transfer/index.vue'),
        meta: {
          title: '转账',
          noCache: true,
          index: 3
        }
      },
      {
        path: '/forgotPassword',
        name: 'ForgotPassword',
        component: () => import('@/views/user/forgotPassword/index.vue'),
        meta: {
          title: '找回密码',
          noCache: true,
          index: 3,
          unLogin: true
        }
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: '登录',
          noCache: true,
          index: 2,
          unLogin: true
        }
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: '注册',
          noCache: true,
          index: 2,
          unLogin: true
        }
      },
      {
        path: '/termsOfService',
        name: 'TermsOfService',
        component: () => import('@/views/user/termsOfService/index.vue'),
        meta: {
          title: '服务条款',
          noCache: true,
          index: 3,
          unLogin: true
        }
      },
      {
        path: '/privacyPolicy',
        name: 'PrivacyPolicy',
        component: () => import('@/views/user/privacyPolicy/index.vue'),
        meta: {
          title: '隐私政策',
          noCache: true,
          index: 3,
          unLogin: true
        }
      },
      {
        path: '/init',
        name: 'Init',
        component: () => import('@/views/init/index.vue'),
        meta: {
          title: '初始化',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/join-us',
        name: 'JoinUs',
        component: () => import('@/views/joinUs/index.vue'),
        meta: {
          title: '合作加盟',
          noCache: false,
          unLogin: true,
          index: 2
        }
      },
      {
        path: '/agent',
        name: 'Agent',
        component: () => import('@/views/agent/index.vue'),
        meta: {
          title: '代理中心',
          noCache: true,
          isAgent: true,
          index: 1
        }
      },
      {
        path: '/agent-list',
        name: 'AgentList',
        component: () => import('@/views/agent/agentList/index.vue'),
        meta: {
          title: '代理列表',
          noCache: false,
          isAgent: true,
          index: 2
        }
      },
      {
        path: '/user-list',
        name: 'UserList',
        component: () => import('@/views/agent/userList/index.vue'),
        meta: {
          title: '会员列表',
          noCache: false,
          isAgent: true,
          index: 2
        }
      },
      {
        path: '/agent-report',
        name: 'AgentReport',
        component: () => import('@/views/agent/agentReport/index.vue'),
        meta: {
          title: '代理盈亏',
          noCache: false,
          isAgent: true,
          index: 2
        }
      },
      {
        path: '/user-report',
        name: 'UserReport',
        component: () => import('@/views/agent/userReport/index.vue'),
        meta: {
          title: '会员盈亏',
          noCache: false,
          isAgent: true,
          index: 2
        }
      },
      {
        path: '/rebate',
        name: 'RebateDetail',
        component: () => import('@/views/agent/rebateDetail/index.vue'),
        meta: {
          title: '返佣比例',
          noCache: false,
          isAgent: true,
          index: 2
        }
      },
      {
        path: '/agent-report-detail',
        name: 'AgentReportDetail',
        component: () => import('@/views/agent/agentReportDetail/index.vue'),
        meta: {
          title: '盈亏明细',
          noCache: true,
          isAgent: true,
          index: 3
        }
      },
      {
        path: '/user-report-detail',
        name: 'UserReportDetail',
        component: () => import('@/views/agent/userReportDetail/index.vue'),
        meta: {
          title: '盈亏明细',
          noCache: true,
          isAgent: true,
          index: 3
        }
      },
      {
        path: '/app-download',
        name: 'AppDownload',
        component: () => import('@/views/appDownload/index.vue'),
        meta: {
          title: 'APP下载',
          noCache: false,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/test-speed',
        name: 'TestSpeed',
        component: () => import('@/views/testSpeed/index.vue'),
        meta: {
          title: '测速页',
          noCache: false,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/tiro-task',
        name: 'TiroTask',
        component: () => import('@/views/activity/TiroTask/index.vue'),
        meta: {
          title: '新手任务',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/deposit-discount',
        name: 'DepositDiscount',
        component: () => import('@/views/activity/DepositDiscount/index.vue'),
        meta: {
          title: '存款优惠',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/friend-invitation',
        name: 'FriendInvitation',
        component: () => import('@/views/activity/FriendInvitation/index.vue'),
        meta: {
          title: '好友邀请',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/first-charge',
        name: 'FirstCharge',
        component: () => import('@/views/activity/FirstCharge/index.vue'),
        meta: {
          title: '新人首充',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/grand-prix',
        name: 'GrandPrix',
        component: () => import('@/views/activity/GrandPrix/index.vue'),
        meta: {
          title: '晋级大奖赛',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/first-back',
        name: 'FirstBack',
        component: () => import('@/views/activity/FirstBack/index.vue'),
        meta: {
          title: '首充返现',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/opening-lottery',
        name: 'OpeningLottery',
        component: () => import('@/views/activity/OpeningLottery/index.vue'),
        meta: {
          title: '开业抽奖',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/mid-autumn-festival',
        name: 'MidAutumnFestival',
        component: () => import('@/views/activity/MidAutumnFestival/index.vue'),
        meta: {
          title: '中秋活动',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/s12-finals',
        name: 'S12Finals',
        component: () => import('@/views/activity/S12Finals/index.vue'),
        meta: {
          title: '新人首充',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/helpCenter',
        name: 'HelpCenter',
        component: () => import('@/views/helpCenter/index.vue'),
        meta: {
          title: '帮助中心',
          noCache: true,
          index: 5,
          unLogin: true
        }
      },
      {
        path: '/ip-error',
        name: 'IpError',
        component: () => import('@/views/error/ip-404/index.vue'),
        meta: {
          title: '',
          noCache: true,
          index: 6,
          unLogin: true
        }
      },
      {
        path: '/404',
        name: 'RouteError',
        component: () => import('@/views/error/route-404/index.vue'),
        meta: {
          title: '',
          noCache: true,
          index: 6,
          unLogin: true
        }
      },
      {
        path: '/grab-red-envelope',
        name: 'GrabRedEnvelope',
        component: () => import('@/views/activity/GrabRedEnvelope/index.vue'),
        meta: {
          title: '抢红包',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/newLol',
        name: 'NewLol',
        component: () => import('@/views/activity/NewLol/index.vue'),
        meta: {
          title: '新电竟返水',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/venue-pay',
        name: 'VenuePay',
        component: () => import('@/views/activity/VenuePay/index.vue'),
        meta: {
          title: '场馆包赔',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/five-game',
        name: 'FiveGame',
        component: () => import('@/views/activity/FiveGame/index.vue'),
        meta: {
          title: '五大联赛',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/guoqing-festival',
        name: 'GuoqingFestival',
        component: () => import('@/views/activity/GuoqingFestival/index.vue'),
        meta: {
          title: '十一国庆节活动',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/gq-red-rain',
        name: 'GqRedRain',
        component: () => import('@/views/activity/gqRedRain/index.vue'),
        meta: {
          title: '国庆节红包雨',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/dota-t1-game',
        name: 'DotaToneGame',
        component: () => import('@/views/activity/DotaToneGame/index.vue'),
        meta: {
          title: 'T1三重活动',
          noCache: true,
          index: 1,
          unLogin: true
        }
      },
      {
        path: '/:path(.*)*',
        redirect: '/404'
      }
    ]
  }
];

export default routes;
