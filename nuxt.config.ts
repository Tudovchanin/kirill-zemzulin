// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  nitro: {
    compressPublicAssets: true,
  },
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
      baseURL: "",
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
    composables: true, 
    extraPlugins: {
      scrollTrigger: true, 
      draggable: true, 
      scrollTo: true, 
      motionPath: true,
      text: true,
      pixi: true,
      flip: true,
    },
    clubPlugins: {
      scrollSmoother: true,
      splitText: true,
    },
  },
  image: {
    domains: ["cdn.sanity.io"], 
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      "2xl": 1536,
    },
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

  app: {
    head: {
      // Атрибуты для тега <html>
      htmlAttrs: {
        lang: "ru", // Указывает язык содержимого страницы. В данном случае русский ('ru').
        // Важно для SEO и доступности (screen readers, поисковые системы).
      },

      // Массив ссылок, которые будут добавлены в <head>
      link: [
        // Основная фавиконка в формате .ico, браузеры по умолчанию ищут именно её
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },

        {
          rel: "icon",
          type: "image/png",
          sizes: "512x512",
          href: "/icons/android-chrome-512x512.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "192x192",
          href: "/icons/android-chrome-192x192.png",
        },
        // Иконка для устройств Apple (iPhone, iPad) при добавлении сайта на главный экран
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/icons/apple-touch-icon.png",
        },

        // Фавиконки в формате PNG с разными размерами для разных устройств и браузеров
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/icons/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/icons/favicon-16x16.png",
        },

        // Специальная иконка для Safari pinned tabs (закреплённых вкладок),
        // с указанием цвета для иконки (цвет акцента)
        {
          rel: "mask-icon",
          href: "/icons/safari-pinned-tab.svg",
          color: "#5bbad5",
        },
      ],

      // Массив метатегов, которые будут добавлены в <head>
      meta: [
        // Цвет плитки для Windows (при закреплении сайта в Windows Start Menu)
        { name: "msapplication-TileColor", content: "#da532c" },

        // Цвет темы браузера (например, цвет адресной строки в мобильных браузерах)
        { name: "theme-color", content: "#ffffff" },
      ],
    },
  },
});
