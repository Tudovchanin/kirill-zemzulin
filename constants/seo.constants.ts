import type { Slug, SeoMeta } from '~/types'

export const CATEGORY_SEO: Record<Slug, SeoMeta> = {
  portraits: {
    title: 'Портретная фотосъёмка в Мичуринске — портфолио Кирилла Земзюлина',
    description: 'Профессиональные портреты от фотографа Кирилла Земзюлина. Индивидуальные фотосессии в Мичуринске и области.',
    imageUrl: '/assets/images/portrait-6.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image'
  },
  weddings: {
    title: 'Свадебная фотосъёмка в Мичуринске — Кирилл Земзюлин',
    description: 'Лучшие свадебные фотографии от опытного фотографа Кирилла Земзюлина. Запечатлейте важные моменты вашего торжества.',
    imageUrl: '/assets/images/portrait-6.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image'
  },
  landscapes: {
    title: 'Пейзажная фотосъёмка в Мичуринске — работы Кирилла Земзюлина',
    description: 'Красивые пейзажи и природные виды, снятые профессиональным фотографом Кириллом Земзюлиным в Мичуринске и окрестностях.',
    imageUrl: '/assets/images/portrait-6.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image'
  }
}


export const ABOUT_SEO:SeoMeta = {
  title: 'О фотографе Кирилле Земзюлине — услуги и история',
  description: 'Узнайте больше о Кирилле Земзюлине, профессиональном фотографе из Мичуринска. Выберите свой пакет услуг.',
  imageUrl: '/assets/images/hero-about-mobile.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image'
}


export const CONTACT_SEO: SeoMeta = {
  title: 'Контакты фотографа Кирилла Земзюлина — заказ фотосессии в Мичуринске',
  description: 'Свяжитесь с Кириллом Земзюлиным для профессиональной фотосъёмки в Мичуринске. Контактная информация, форма обратной связи и адрес студии.',
  imageUrl: '/assets/images/hero-home-mobile.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image'
}


export const HOME_SEO: SeoMeta = {
  title: 'Портфолио фотографа Кирилла Земзюлина — профессиональная фотосъёмка в Мичуринске',
  description: 'Профессиональные фотосессии: свадьбы, пейзажи, портреты. Кирилл Земзюлин — опытный фотограф из Мичуринска.',
  imageUrl: '/assets/images/hero-about-mobile.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image'
}
