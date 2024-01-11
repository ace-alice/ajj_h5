export default function defaultImageHook() {
  // 公告
  const announcementDefaultImage = require('@/assets/other/announcementDefaultImage.webp')
  // 站内信
  const letterDefaultImage = require('@/assets/other/letterDefaultImage.webp')
  // 银行卡
  const bankDefaultImage = require('@/assets/other/bankDefaultImage.webp')
  // usdt账户
  const USDTDefaultImage = require('@/assets/other/USDTDefaultImage.webp')
  // 头像默认头像
  const avatarDefaultImage = require('@/assets/home/defaultImage.png')
  // 页头默认图片
  const pageHeaderDefaultImage = require('@/assets/other/logo-common.webp')

  const errorDefaultImage = require('@/assets/other/default_company_logo.png')

  return {
    announcementDefaultImage,
    letterDefaultImage,
    bankDefaultImage,
    USDTDefaultImage,
    avatarDefaultImage,
    pageHeaderDefaultImage,
    errorDefaultImage
  }
}
