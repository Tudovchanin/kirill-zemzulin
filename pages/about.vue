<script setup lang="ts">
import { NuxtLink } from "#components";
import { ABOUT_SEO } from "~/constants/seo.constants";

const baseUrl = useBaseUrl();
const absoluteImageUrl = baseUrl + ABOUT_SEO.imageUrl;
useSeoMeta({
  title: ABOUT_SEO.title,
  description: ABOUT_SEO.description,
  ogTitle: ABOUT_SEO.title,
  ogDescription: ABOUT_SEO.description,
  ogImage: absoluteImageUrl,
  ogType: ABOUT_SEO.ogType || "website",
  twitterCard: ABOUT_SEO.twitterCard || "summary_large_image",
});

useHead({
  link: [{ rel: "canonical", href: `${baseUrl}/about` }],
});

const categoriesStore = useCategoriesStore();

let animatePricingTitle: gsap.core.Tween | null = null;
let animatePricingText: gsap.core.Tween | null = null;
let animateCards: gsap.core.Tween[] = [];

const initSplitTextAnimation = (
  direction: string,
  selectorAnimate: string,
  type: "chars" | "words",
  scrollTriggerSelector?: string
) => {
  const split = new useSplitText(selectorAnimate, {
    type: "chars, words",
    aria: "hidden",
  });

  useGsap.set(split[type], { [direction]: -100, autoAlpha: 0 });

  const animate = useGsap.fromTo(
    split[type],
    { [direction]: -100, autoAlpha: 0 },
    {
      duration: 0.5,
      [direction]: 0,
      autoAlpha: 1,
      stagger: 0.1,
      scrollTrigger: scrollTriggerSelector
        ? { trigger: scrollTriggerSelector }
        : null,
    }
  );

  return animate;
};
const initCardsAnimation = (cards: NodeListOf<Element>): gsap.core.Tween[] => {
  const animations: gsap.core.Tween[] = [];

  cards.forEach((card, index) => {
    const direction = index % 2 ? "left" : "right";
    const animation = useGsap.fromTo(
      card,
      {
        x: direction === "left" ? -1000 : 1000,
        rotate: 100,
        opacity: 0,
      },
      {
        x: 0,
        rotate: 0,
        opacity: 1,

        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );

    animations.push(animation);
  });

  return animations;
};

watch(
  () => categoriesStore.categories.length,
  async () => {
    await nextTick();
    const cardsPackage = document.querySelectorAll(".package-card");
    animateCards = initCardsAnimation(cardsPackage);
  }
);

onMounted(async () => {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  animatePricingTitle = initSplitTextAnimation(
    "y",
    ".pricing-title-animate",
    "chars",
    ".pricing__grid"
  );
  animatePricingText = initSplitTextAnimation(
    "x",
    ".pricing-description-animate",
    "words",
    ".pricing__grid"
  );

  await nextTick();

  const cardsPackage = document.querySelectorAll(".package-card");

  if (!animateCards.length) {
    animateCards = initCardsAnimation(cardsPackage);
  }
});

onBeforeUnmount(() => {
  if (animatePricingTitle) {
    animatePricingTitle?.kill();
  }
  if (animatePricingTitle) {
    animatePricingText?.kill();
  }

  if (animateCards.length > 0) {
    animateCards.forEach((animate) => animate.kill());
  }
});
</script>
<template>
  <div class="about page-padding-x page-padding-y width-page x-center">
    <div class="about__hero">
      <h1 class="about__title-hero">
        Кирилл Земзюлин — портретный, пейзажный и свадебный фотограф из
        Мичуринска
      </h1>
      <div class="about__text-hero">
        <p class="p-hero">
          Портфолио Кирилла включает творческие и деловые портреты, красивые
          пейзажи и трогательные свадебные фотосессии. Он умеет ловить важные
          моменты и создавать фотографии, которые сохранят ваши воспоминания на
          долгие годы.
        </p>

        <p class="p-hero">
          Кирилл не только профессиональный фотограф, но и стилист, который
          помогает подобрать идеальный образ для каждой съёмки. Его внимательный
          подход к деталям и умение создавать гармоничные образы делают
          фотографии живыми и вдохновляющими, идеально подходящими для тех, кто
          ценит качество и индивидуальный стиль.
        </p>
      </div>
    </div>

    <section class="pricing">
      <div class="pricing__header">
        <h2 class="sr-only">Пакеты фотосессий</h2>
        <p class="sr-only">
          Выберите подходящий пакет фотосессии, который идеально соответствует
          вашим потребностям. Каждый из них гарантирует высокое качество съёмки
          и обработки, а также индивидуальный подход.
        </p>

        <div class="pricing__title pricing-title-animate">
          Пакеты фотосессий
        </div>
        <div class="pricing__description pricing-description-animate">
          Выберите подходящий пакет фотосессии, который идеально соответствует
          вашим потребностям. Каждый из них гарантирует высокое качество съёмки
          и обработки, а также индивидуальный подход.
        </div>
      </div>

      <div v-if="categoriesStore.categories.length" class="pricing__grid">
        <template
          v-for="category in categoriesStore.categories"
          :key="category._id"
        >
          <template v-if="category.packages.length">
            <article
              v-for="packagePhoto in category.packages"
              :key="packagePhoto._id"
              tabindex="0"
              class="pricing__card package-card"
            >
              <header class="package-card__header">
                <h3 class="package-card__title">
                  {{ packagePhoto.title }}
                </h3>
                <p class="package-card__price">{{ packagePhoto.price }}</p>
              </header>
              <div
                v-if="packagePhoto.features?.length"
                class="package-card__content"
              >
                <ul class="package-card__features">
                  <li v-for="item in packagePhoto.features" :key="item">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <footer class="package-card__footer">
                <NuxtLink to="/contact" class="package-card__link base-btn"
                  >Забронировать</NuxtLink
                >
              </footer>
            </article>
          </template>
        </template>
      </div>

      <div v-else class="pricing__grid pricing__grid--skeleton">
        <svg
          class="skeleton-loader"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
        >
          <rect
            fill="#000000"
            stroke="#000000"
            stroke-width="11"
            width="30"
            height="30"
            x="25"
            y="85"
          >
            <animate
              attributeName="opacity"
              calcMode="spline"
              dur="2"
              values="1;0;1;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin="-.4"
            />
          </rect>
          <rect
            fill="#000000"
            stroke="#000000"
            stroke-width="11"
            width="30"
            height="30"
            x="85"
            y="85"
          >
            <animate
              attributeName="opacity"
              calcMode="spline"
              dur="2"
              values="1;0;1;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin="-.2"
            />
          </rect>
          <rect
            fill="#000000"
            stroke="#000000"
            stroke-width="11"
            width="30"
            height="30"
            x="145"
            y="85"
          >
            <animate
              attributeName="opacity"
              calcMode="spline"
              dur="2"
              values="1;0;1;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin="0"
            />
          </rect>
        </svg>
      </div>

      <div class="pricing__footer">
        <p>
          Все фотосессии проходят в Мичуринске и ближайших живописных локациях
          Тамбовской области.
        </p>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.about {
  display: flex;
  flex-direction: column;
  gap: 200px;

  &::before {
    position: absolute;
    content: "";
    top: -350px;
    right: 55vw;
    z-index: -1;
    width: 500px;
    height: 150%;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.053) 0%,
      rgba(200, 200, 200, 0.1) 15%,
      rgba(234, 192, 101, 0.404) 50%,
      rgba(178, 151, 92, 0.404) 100%
    );
    opacity: 0;
    filter: blur(25px);
    transform-origin: center center;
    transform: rotate(25deg);
    animation: light-beam 1.5s linear 1s forwards;

    @media (max-width: 1200px) {
      right: 60vw;
      width: 200px;
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    gap: 100px;
  }

  &__hero {
    position: relative;
    max-width: 700px;
    min-height: 600px;
    height: calc(100vh - 200px);
    opacity: 0;
    animation: animate-hero 0.5s 0.5s forwards;
    @media (max-width: 768px) {
      height: auto;
    }
  }

  &__title-hero {
    margin-bottom: var(--gap-heading-main);
    font-size: var(--adaptive-font-24-30);
    color: var(--color-text-primary);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  }

  &__text-hero {
    display: flex;
    flex-direction: column;
    gap: var(--gap-text);
    color: var(--color-text-primary);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    font-size: 16px;
    @media (max-width: 768px) {
      font-size: 14px;
    }
   }
}
@keyframes fire {
  0%      { background-position:    0px    0px; }
  2.08%   { background-position: -100px    0px; }
  4.17%   { background-position: -200px    0px; }
  6.25%   { background-position: -300px    0px; }
  8.33%   { background-position: -400px    0px; }
  10.42%  { background-position: -500px    0px; }
  12.5%   { background-position: -600px    0px; }
  14.58%  { background-position: -700px    0px; }

  16.67%  { background-position:    0px -100px; }
  18.75%  { background-position: -100px -100px; }
  20.83%  { background-position: -200px -100px; }
  22.92%  { background-position: -300px -100px; }
  25%     { background-position: -400px -100px; }
  27.08%  { background-position: -500px -100px; }
  29.17%  { background-position: -600px -100px; }
  31.25%  { background-position: -700px -100px; }

  33.33%  { background-position:    0px -200px; }
  35.42%  { background-position: -100px -200px; }
  37.5%   { background-position: -200px -200px; }
  39.58%  { background-position: -300px -200px; }
  41.67%  { background-position: -400px -200px; }
  43.75%  { background-position: -500px -200px; }
  45.83%  { background-position: -600px -200px; }
  47.92%  { background-position: -700px -200px; }

  50%     { background-position:    0px -300px; }
  52.08%  { background-position: -100px -300px; }
  54.17%  { background-position: -200px -300px; }
  56.25%  { background-position: -300px -300px; }
  58.33%  { background-position: -400px -300px; }
  60.42%  { background-position: -500px -300px; }
  62.5%   { background-position: -600px -300px; }
  64.58%  { background-position: -700px -300px; }

  66.67%  { background-position:    0px -400px; }
  68.75%  { background-position: -100px -400px; }
  70.83%  { background-position: -200px -400px; }
  72.92%  { background-position: -300px -400px; }
  75%     { background-position: -400px -400px; }
  77.08%  { background-position: -500px -400px; }
  79.17%  { background-position: -600px -400px; }
  81.25%  { background-position: -700px -400px; }

  83.33%  { background-position:    0px -500px; }
  85.42%  { background-position: -100px -500px; }
  87.5%   { background-position: -200px -500px; }
  89.58%  { background-position: -300px -500px; }
  91.67%  { background-position: -400px -500px; }
  93.75%  { background-position: -500px -500px; }
  95.83%  { background-position: -600px -500px; }
  97.92%  { background-position: -700px -500px; }
  100%    { background-position:    0px    0px; } /* для плавного зацикливания */
}

.pricing {
  position: relative;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-heading-section);
    padding-bottom: var(--gap-card-outer);
    text-align: center;
    @media (max-width: 768px) {
      margin-bottom: 70px;
    }
  }

  &__title {
    font-size: var(--adaptive-font-24-30);
    color: var(--color-text-primary);
  }

  &__description {
    max-width: 900px;
    font-size: 16px;
    color: var(--color-text-primary);
  }

  &__grid {
    display: grid;
    grid-template-columns: 500px 500px;
    justify-content: center;
    justify-items: center;
    gap: var(--gap-card-inner);
    min-height: 600px;
    padding-bottom: var(--gap-heading-section);

    @media (max-width: 1200px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    &--skeleton {
      display: block;
      text-align: center;
    }
  }

  &__card {
    position: relative;
    overflow: hidden;
    opacity: 0; 
    &:focus {
      opacity: 1;
      transform: none;
      outline: var(--color-accent-primary) solid 1px;
    }

  &::before {
    position: absolute;
    content: '';
    top: 0;
    right: 0;
    background-image: url('/assets/images/fire-min.png');
    background-position:left top;
    background-size: 800px 600px;
    background-position: 0 0;
    width: 100px;
    height: 100px;
    // border: solid red;
    animation: fire 3s steps(1) infinite alternate;

  }
  }

  &__footer {
    padding-top: 50px;
    padding-bottom: 50px;
    font-size: 16px;
    color: var(--color-text-secondary);
  }
}

.package-card {
  display: flex;
  flex-direction: column;
  gap: var(--gap-card-inner);
  width: 100%;
  max-width: 500px;
  padding: 15px 20px;
  background-color: var(--bg-card);

  &__title {
    font-size: var(--adaptive-font-24-30);
    font-weight: 700;
    font-family: "Alumni Sans SC", Inter, sans-serif;
    color: var(--color-text-primary);
  }

  &__price {
    font-weight: 700;
    color: var(--color-text-primary);
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: var(--gap-list-item);
    color: var(--color-text-primary);
  }

  &__link {
    width: fit-content;
  }
}

.p-hero {
  font-size: var(--adaptive-font-16-20);
  line-height: 1.3;
}

.skeleton-loader {
  width: 200px;
}

@keyframes animate-hero {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes light-beam {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
