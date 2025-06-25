// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  // nitro: {
  //   prerender: {
  //     routes: [
  //       '/categories/portraits',
  //       '/categories/weddings',
  //       '/categories/landscapes',
  //     ]
  //   }
  // },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/sanity",
    "@hypernym/nuxt-gsap",
    "@nuxt/image",
    "@nuxtjs/google-fonts",
    "@nuxt/icon",
    "@nuxt/eslint",
    "nuxt-typedjs",
    "nuxt-mail",
  ],

  runtimeConfig: {
    mail: {
      message: {
        to: "sotto36623@gmail.com",
      },
      smtp: {
        host: "smtp.yandex.ru",
        port: 465,
        secure: true,
        auth: {
          user: process.env.YANDEX_EMAIL_USER,
          pass: process.env.YANDEX_EMAIL_PASS,
        },
      },
    },
    public: {
      baseURL: '',
    },
  },
  devtools: { enabled: false },

  sanity: {
    projectId: "bf228vx5",
    dataset: "production",
  },

  css: ["~/assets/scss/style.scss"],

  typescript: {
    typeCheck: true,
    strict: true,
  },

  gsap: {
    composables: true, // Включаем композаблы GSAP
    // Подключаем основные бесплатные плагины GSAP
    extraPlugins: {
      scrollTrigger: true, // Плагин для анимаций, привязанных к скроллу
      draggable: true, // Плагин для перетаскивания элементов
      scrollTo: true, // Плавная прокрутка к элементам
      motionPath: true, // Анимация по пути (SVG и др.)
      text: true, // Анимация текста (смена текста, эффекты)
      pixi: true, // Интеграция с PixiJS (для WebGL-анимаций)
      flip: true,
    },
    clubPlugins: {
      scrollSmoother: true,
      splitText: true,
    },
  },

  image: {
    domains: ["cdn.sanity.io"], // разрешаем оптимизацию изображений с Sanity
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      "2xl": 1536,
    },
    // format: ['webp', 'auto']
  },

  googleFonts: {
    families: {
      "Space Grotesk": [400, 600], // Указываем шрифт и нужные веса (400 — нормальный, 700 — жирный). Если шрифт есть в Google Fonts, он будет загружен автоматически.
      Inter: [400, 700], // Аналогично для Inter — популярный шрифт с поддержкой кириллицы.
      "Alumni Sans SC": [400, 700],
    },

    display: "swap", // Свойство font-display для CSS. 'swap' означает, что сначала будет показан запасной шрифт, а когда загрузится нужный — он заменит запасной. Это улучшает восприятие загрузки.
    prefetch: true, // Включает предварительную загрузку DNS-запроса (dns-prefetch) для домена Google Fonts, что ускоряет подключение.
    preload: true, // Добавляет тег <link rel="preload"> для шрифтов, чтобы браузер начал загрузку шрифтов как можно раньше.
    preconnect: true, // Добавляет <link rel="preconnect"> для установления раннего соединения с сервером Google Fonts, что сокращает задержки.
  },
});
