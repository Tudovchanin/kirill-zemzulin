// stylelint.config.js
export default   {
  // Расширяем стандартный конфиг для SCSS с базовыми правилами
  extends: "stylelint-config-standard-scss",

  // Подключаем плагин для контроля порядка CSS-свойств
  plugins: ["stylelint-order"],

  // Переопределения для специфичных файлов
  overrides: [
    {
      // Для всех Vue компонентов
      files: ["**/*.vue"],

      // Используем парсер, который умеет извлекать стили из <style> в .vue файлах
      customSyntax: "postcss-html",
    },
  ],

  rules: {
    // Правило, задающее порядок CSS-свойств
    "order/properties-order": [
      "position",
      "content", 
      "top",
      "right",
      "bottom",
      "left",
      "z-index",

      "display",
      "float",
      "width",
      "min-width",
      "max-width",
      "height",
      "min-height",
      "max-height",

      "margin",
      "margin-top",
      "margin-right",
      "margin-bottom",
      "margin-left",

      "padding",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",

      "font",
      "font-style",
      "font-size",
      "font-weight",
      "font-family",
      "line-height",
      "text-align",
      "text-transform",
      "color",

      
      "background",
      "background-color",
      "background-image",
      "background-repeat",
      "background-position",
      "background-size",
      "mask-image",

      "border",
      "border-radius",

      "opacity",
      "filter",
      "backdrop-filter",
      "cursor",

      "transform",
      "transition",
      "animation",

      "overflow",
      "will-change",

    ],
    // Отключаем ошибку пустого файла стилей
    "no-empty-source": null,

    "media-feature-range-notation": "prefix",

    "selector-class-pattern": "^[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$",
    "length-zero-no-unit": true,

    "color-function-alias-notation": null,
    "color-function-notation": null,
    "alpha-value-notation": null,
    "hue-degree-notation": null,
    "custom-property-empty-line-before": null,
  }
  
  

};
