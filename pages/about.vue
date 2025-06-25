<script setup lang="ts">
import { NuxtLink } from '#components';
import { ABOUT_SEO } from '~/constants/seo.constants';

const baseUrl = useBaseUrl();



useSeoMeta({
  title: ABOUT_SEO.title,
  description: ABOUT_SEO.description,
  ogTitle: ABOUT_SEO.title,
  ogDescription: ABOUT_SEO.description,
  ogImage: ABOUT_SEO.imageUrl,
  ogType: ABOUT_SEO.ogType || 'website',
  twitterCard: ABOUT_SEO.twitterCard || 'summary_large_image',
})

useHead({
  link: [
    { rel: 'canonical', href: `${baseUrl}/about` }
  ]
})

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
        autoAlpha: 0,
      },
      {
        x: 0,
        rotate: 0,
        autoAlpha: 1,

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
    const cardsPackage = document.querySelectorAll('.package-card');
    animateCards = initCardsAnimation(cardsPackage)
  }
);

onMounted(async () => {
  animatePricingTitle = initSplitTextAnimation(
    "y",
    ".pricing__title",
    "chars",
    ".pricing__grid"
  );
  animatePricingText = initSplitTextAnimation(
    "x",
    ".pricing__description",
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
  if(animatePricingTitle) {
    animatePricingTitle?.kill();
  }
  if(animatePricingTitle) {
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

    <section class="pricing" aria-labelledby="pricing-heading">
      <div class="pricing__header">
        <h2 id="pricing-heading" class="pricing__title">Пакеты фотосессий</h2>
        <p class="pricing__description">
          Выберите подходящий пакет фотосессии, который идеально соответствует
          вашим потребностям. Каждый из них гарантирует высокое качество съёмки
          и обработки, а также индивидуальный подход.
        </p>
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
              class="pricing__card package-card"
              :aria-labelledby="`package-heading-${packagePhoto._id}`"
            >
              <header class="package-card__header">
                <h3
                  :id="`package-heading-${packagePhoto._id}`"
                  class="package-card__title"
                >
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
                  >Забронировать</NuxtLink>
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

  @media (max-width: 120px) {
    gap: 150px;
  }

  @media (max-width: 768px) {
    gap: 120px;
  }

  &__hero {
    position: relative;
    max-width: 700px;
    min-height:  600px;
    opacity: 0;
    animation: animate-hero 1s 1.2s forwards;

    &::before {
      position: absolute;
      content: "";
      top: -100px;
      left: -100px;
      z-index: -1;
      width: 100%;
      height: 50%;
      background-color: rgba(104, 104, 104);
      filter: blur(60px);

      @media (max-width: 768px) {
        top: 0;
        right: 0;
        left: 0;
        height: 80%;
        background-color: rgba(0, 0, 0, 0.5);
      }
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
  }
}

.pricing {
  position: relative;

  &::before {
    position: absolute;
    content: "";
    top: -400px;
    left: -1200px;
    z-index: -1;
    width: 4000px;
    height: 50%;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.053) 0%,
      rgba(200, 200, 200, 0.1) 50%,

      rgba(234, 192, 101, 0.566) 100%
    );
    opacity: 0;
    filter: blur(25px);
    transform: rotate(-50deg);
    animation: light-beam 1.5s linear 1s forwards;

    @media (max-width: 1200px) {
      width: 3400px;
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-heading-section);
    padding-bottom: var(--gap-card-outer);
    text-align: center;
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
    outline: var(--color-accent-primary) solid 1px;
    visibility: hidden;
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
