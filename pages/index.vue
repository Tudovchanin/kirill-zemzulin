<script setup lang="ts">
import Typed from "typed.js";
import { CATEGORY_SLUG_MAP } from "~/constants/mappings.constants";
import { PLUG } from "~/constants/app.constants";
import { HOME_SEO } from "~/constants/seo.constants";
import { useDevice } from "~/composables/useDevice";

type AnimationController = {
  removeAnimate: () => void;
};

const baseUrl = useBaseUrl();
const absoluteImageUrl = baseUrl + HOME_SEO.imageUrl;

useSeoMeta({
  title: HOME_SEO.title,
  description: HOME_SEO.description,
  ogTitle: HOME_SEO.title,
  ogDescription: HOME_SEO.description,
  ogImage: absoluteImageUrl,
  ogType: HOME_SEO.ogType || "website",
  twitterCard: HOME_SEO.twitterCard || "summary_large_image",
});
useHead({
  link: [{ rel: "canonical", href: baseUrl }],
});

const categoriesStore = useCategoriesStore();
const {device, imageSizes} = useDevice();

const aboutHomeRef = ref();

const loadImg = ref<boolean[]>(categoriesStore.categories.map(() => false));
const handleLoadImg = (index: number) => {
  loadImg.value[index] = true;
};

let mobileWidthMediaQuery: MediaQueryList | null = null;

let animateCardCategoriesScroll: ScrollTrigger | null = null;
let animateHomeAboutTyped: ScrollTrigger | null = null;
let typedInstance: null | Typed = null;
let animateLinkInMobile: null | AnimationController = null;
let animateHomeAboutAppearance: gsap.core.Tween | null = null;

watch(
  () => categoriesStore.categories,
  async (newCategories) => {
    if (newCategories.length) {
      await nextTick();
      animateCardCategoriesScroll = initAnimateCardCategoriesScroll();
      if (mobileWidthMediaQuery?.matches) {
        handleMediaQueryMobile({
          matches: mobileWidthMediaQuery.matches,
        } as MediaQueryListEvent);
      }
    }
  }
);

const initAnimateCardCategoriesScroll = () => {
  const scrollTrigger = new useScrollTrigger({
    trigger: ".categories",
    start: "top top",
    end: "bottom top",
    scrub: 0.3,
    animation: useGsap.to(".categories__container-img", {
      opacity: 0,
      duration: 0.5,
      x: 500,
      stagger: 0.3,
      ease: "elastic.inOut",
    }),
  });

  return scrollTrigger;
};
const initAnimateHomeAboutTyped = () => {
  const scrollTrigger = new useScrollTrigger({
    trigger: aboutHomeRef.value,
    start: "center bottom",
    onEnter: () => {
      if (!typedInstance) {
        typedInstance = new Typed("#typed", {
          stringsElement: "#typed-strings",
          typeSpeed: 50,
        });
      }
    },
  });

  return scrollTrigger;
};
const initAnimateHomeAboutAppearance = () => {
  useGsap.set(".about-animate", { xPercent: -100 });

  const animate = useGsap.fromTo(
    ".about-animate",
    {
      xPercent: -100,
    },
    {
      xPercent: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: ".about-animate",
        start: "200px bottom",
        end: "bottom bottom",
        scrub: true,
      },
    }
  );

  return animate;
};
const initAnimateMobileLink = () => {
  const elementsLinksCategory = document.querySelectorAll(".categories__link");
  const scrollTriggers: ScrollTrigger[] = [];
  const animations: gsap.core.Tween[] = [];

  elementsLinksCategory.forEach((link) => {
    const animation = useGsap.to(link, {
      transform: "scale(1.1) translateY(-20px)",
    });

    const scrollTrigger = new useScrollTrigger({
      trigger: link,
      start: "top center",
      end: "bottom center",
      scrub: true,
      animation: animation,
    });

    animations.push(animation);
    scrollTriggers.push(scrollTrigger);
  });

  return {
    removeAnimate() {
      console.log("delete animate");

      animations.forEach((anim) => anim.kill());
      scrollTriggers.forEach((trigger) => trigger.kill());
      useGsap.set(".categories__link", { clearProps: "transform" });
    },
  };
};

const handleMediaQueryMobile = (e: MediaQueryListEvent) => {
  if (e.matches) {
    animateLinkInMobile = initAnimateMobileLink();
  } else {
    animateLinkInMobile?.removeAnimate();
  }
};

onMounted(() => {
  mobileWidthMediaQuery = window.matchMedia("(max-width: 768px)");
  mobileWidthMediaQuery.addEventListener("change", handleMediaQueryMobile);

  if (mobileWidthMediaQuery.matches) {
    handleMediaQueryMobile({
      matches: mobileWidthMediaQuery.matches,
    } as MediaQueryListEvent);
  }

  if (categoriesStore.categories.length && !animateCardCategoriesScroll) {
    animateCardCategoriesScroll = initAnimateCardCategoriesScroll();
  }

  if (!animateHomeAboutTyped) {
    animateHomeAboutTyped = initAnimateHomeAboutTyped();
  }

  if (!animateHomeAboutAppearance) {
    animateHomeAboutAppearance = initAnimateHomeAboutAppearance();
  }
});

onUnmounted(() => {
  if (mobileWidthMediaQuery) {
    mobileWidthMediaQuery.removeEventListener("change", handleMediaQueryMobile);
  }
  if (animateLinkInMobile) {
    animateLinkInMobile.removeAnimate();
  }

  if (animateCardCategoriesScroll) {
    animateCardCategoriesScroll.kill();
  }

  if (animateHomeAboutTyped) {
    animateHomeAboutTyped.kill();
  }

  if (animateHomeAboutAppearance) {
    animateHomeAboutAppearance.kill();
  }
});
</script>
<template>
  <div class="home page-padding-x page-padding-y width-page x-center">
    <h1 class="sr-only">
      Кирилл Земзюлин — фотограф портретов и лайфстайл из Мичуринска
    </h1>

    <section>
      <h2 class="sr-only">Категории фотографий</h2>
      <ul
        v-if="categoriesStore.categories.length"
        class="categories page-padding-y"
      >
        <li
          v-for="(category, index) in categoriesStore.categories"
          :key="category._id"
          class="categories__container-img"
        >
          <NuxtLink
            v-show="loadImg[index]"
            :to="`/categories/${CATEGORY_SLUG_MAP[category.title]}`"
            class="categories__link"
          >
            <NuxtImg
              draggable="false"
              :src="
                device === 'mobile'
                  ? category.mobileTitleImageUrl
                    ? category.mobileTitleImageUrl
                    : category.titleImageUrl
                  : category.titleImageUrl
              "
              :width="imageSizes.width"
              :height="imageSizes.height"
              class="categories__img appear"
              :class="{ [`appear--${index}`]: loadImg[index] }"
              :alt="loadImg[index] ? 'обложка категорий фото' : ''"
              @load="handleLoadImg(index)"
              format="webp"
            />

            <h3 v-show="loadImg[index]" class="categories__title">
              {{ category.title }}
            </h3>
          </NuxtLink>

          <div v-show="!loadImg[index]" class="categories__container-img">
            <div class="categories__loader">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
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
            <NuxtImg
              v-if="device === 'desc'"
              :src="PLUG"
              :width="imageSizes.width"
              :height="imageSizes.height"
              alt="Загрузка изображения..."
            />
            <NuxtImg
              v-else-if="device === 'mobile'"
              :src="PLUG"
              :width="imageSizes.width"
              :height="imageSizes.height"
              alt="Загрузка изображения..."
            />
          </div>
        </li>
      </ul>
    </section>

    <section ref="aboutHomeRef" class="about-home about-home--mb about-animate">
      <h2 class="about-home__title">Обо мне</h2>
      <div class="about-home__text">
        <div id="typed-strings" class="sr-only">
          <p>
            <strong>Кирилл Земзюлин</strong> — фотограф портретов и лайфстайл из
            уютного города Мичуринск. Он обладает уникальным даром ловить момент
            и превращать его в чёткое выразительное изображение, передающее
            настоящие эмоции и истинную красоту.
          </p>
        </div>
        <span id="typed"></span>
      </div>

      <NuxtLink to="/contact" class="about-home__link base-btn"
        >Контакты</NuxtLink
      >
    </section>
  </div>
</template>
<style lang="scss" scoped>
.categories {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 400px;

  @media (max-width: 768px) {
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    margin-bottom: 100px;
  }

  &__container-img {
    position: relative;
    flex-basis: 33.333%;
    line-height: 0;
    cursor: pointer;

    @media (max-width: 768px) {
      width: 80vw;
    }
  }

  &__link {
    height: 100%;
    opacity: 0.95;

    @media (max-width: 768px) {
      opacity: 1;
    }

    @media (hover: hover) {
      transition: transform 0.3s, opacity 0.3s;

      &:hover {
        opacity: 1;
        transform: scale(1.02);
      }

    }
  }

  &__img {
    width: 100%;
  }

  &__loader {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    opacity: 0.2;
    transform: translate(-50%, -50%);
  }

  &__title {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    padding: 10px 20px;
    font-size: var(--adaptive-font-24-30);
    line-height: 1.3;
    color: var(--color-text-primary);
    background-color: rgba(0, 0, 0, 0.603);
    opacity: 0;
    transform: translate(-50%, -50%);
    pointer-events: none;
    animation: title 0.5s 0.5s forwards;
  }
}

.about-home {
  display: grid;
  justify-items: center;
  gap: 20px;
  padding-top: 100px;
  padding-bottom: 100px;
  background-color: var(--color-primary);
  mix-blend-mode: multiply;

  @media (max-width: 768px) {
    padding-top: 50px;
    padding-bottom: 50px;
  }

  @media (max-width: 480px) {
    padding-top: 30px;
    padding-bottom: 30px;
  }

  &--mb {
    margin-bottom: 200px;

    @media (max-width: 768px) {
      margin-bottom: 100px;
    }

    @media (max-width: 330px) {
      margin-bottom: 50px;
    }
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--color-accent-primary);
    overflow: hidden;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }

  &__text {
    width: 100%;
    max-width: 1300px;
    min-height: 8em;
    font-size: var(--adaptive-font-16-30);
    font-family: Inter, sans-serif;
    text-align: center;
    color: var(--color-text-primary);

    @media (max-width: 400px) {
      min-height: 10em;
    }

    @media (max-width: 330px) {
      min-height: 12em;
    }
  }
}

.appear {
  opacity: 0;

  &--0 {
    animation: smooth-appear 0.2s linear forwards;
  }

  &--1 {
    animation: smooth-appear 0.3s linear forwards;
  }

  &--2 {
    animation: smooth-appear 0.4s linear forwards;
  }
}

.about-animate {
  opacity: 0;
}

@keyframes hover-img {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.05);
  }
}

@keyframes smooth-appear {
  0% {
    opacity: 0;
    transform: translateX(500px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes title {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
