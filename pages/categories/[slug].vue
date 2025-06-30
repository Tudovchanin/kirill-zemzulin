<script setup lang="ts">
import type { Slug, Image } from "~/types";
import { SLUG_CATEGORY_MAP } from "~/constants/mappings.constants";
import { CATEGORY_SEO } from "~/constants/seo.constants";

const baseUrl = useBaseUrl();


const route = useRoute();
const categoriesStore = useCategoriesStore();
const popUpStore = usePopUpStore();


const slug = ref<Slug | null>(null);

let countLoad = 0;

const lengthImages = computed(() => {
    return slug.value && categoriesStore.imagesByCategory[slug.value]?.length || 0;
})

watch(
  () => slug.value,
  (newSlug) => {
    if (newSlug) {
      countLoad = 0;
      useSeoMeta({
        title: CATEGORY_SEO[newSlug].title,
        description: CATEGORY_SEO[newSlug].description,
        ogTitle: CATEGORY_SEO[newSlug].title,
        ogDescription: CATEGORY_SEO[newSlug].description,
        ogImage: baseUrl + CATEGORY_SEO[newSlug].imageUrl,
        ogType: CATEGORY_SEO[newSlug].ogType || "website",
        twitterCard: CATEGORY_SEO[newSlug].twitterCard || "summary_large_image",
      });

      useHead({
        link: [{ rel: "canonical", href: `${baseUrl}/${slug.value}` }],
      });
    }
  }
);


const masonryRef = ref<HTMLElement | null>(null);
const photoRef = ref<HTMLElement[] | []>([]);

  const handleLoadImage = () => {
  if (!slug.value || !lengthImages.value) return;

  countLoad++;

  const needToLoad = Math.min(lengthImages.value, 7);

  if (countLoad === needToLoad) {
    animateLoadPhoto = initAnimateLoadAnimation();
  }
};


let animateLoadPhoto: gsap.core.Tween | null = null;
const masonryImagesRef = ref<HTMLElement[]>([]);

const initAnimateLoadAnimation = () => {
  const animate = useGsap.fromTo(
    ".animate-photo",
    {
      opacity: 0,
      x: (index) => (index % 2 === 0 ? 1500 : -1500),

    },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: "expo.out",
      stagger: 0.05,
      onComplete: () => {
        useGsap.to(".photos-category__title", { opacity: 1 });
      },
    }
  );

  return animate;
};

const handleClickImg = (img: Image) => {
  popUpStore.setPopUp(true);
  popUpStore.setPopUpImg(img);
};


onMounted(async () => {
  if (route.params?.slug) {
    slug.value = route.params.slug as Slug;
  }
});
onUnmounted(() => {
  if (animateLoadPhoto) {
    animateLoadPhoto?.kill();
  }
});


</script>
<template>
  <div ref="masonryRef" class="photos-category page-padding-x page-padding-y width-page x-center">
    <h1 class="photos-category__title">
      {{ slug && SLUG_CATEGORY_MAP[slug] }}
    </h1>
    <section aria-labelledby="photos-category-title" class="masonry">
      <h2 id="photos-category-title" class="sr-only">
        Фотографии категории {{ slug && SLUG_CATEGORY_MAP[slug] }}
      </h2>
      <template v-if="categoriesStore.imagesByCategory && slug">
        <ul>
          <li v-for="(img, index) in categoriesStore.imagesByCategory[slug!]" :key="img._id" ref="masonryImagesRef"
            class="masonry__item" :class="{ 'animate-photo': index < 7 }" @click.stop="handleClickImg(img)">
            <NuxtImg ref="photoRef" draggable="false" :src="img.url" :width="img.width" :height="img.height"
              sizes="md:700" class="masonry__img" :alt="img.title || 'картинка без описания'"
              @load="handleLoadImage" :loading="index >= 7 ? 'lazy' : 'eager'" />
          </li>
        </ul>
      </template>

      <div v-else class="masonry__skeleton">
        <svg class="skeleton-loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <rect fill="#000000" stroke="#000000" stroke-width="11" width="30" height="30" x="25" y="85">
            <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite" begin="-.4" />
          </rect>
          <rect fill="#000000" stroke="#000000" stroke-width="11" width="30" height="30" x="85" y="85">
            <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite" begin="-.2" />
          </rect>
          <rect fill="#000000" stroke="#000000" stroke-width="11" width="30" height="30" x="145" y="85">
            <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite" begin="0" />
          </rect>
        </svg>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.photos-category {
  position: relative;

  &__title {
    margin-bottom: var(--gap-heading-section);
    font-size: var(--adaptive-font-24-30);
    color: var(--color-text-primary);
    opacity: 0;
  }
}


.masonry {
  columns: 3 500px;
  min-height: 10000px;
  animation: photo-masonry 0.5s linear forwards;

  &__item {
    text-align: center;
    cursor: pointer;  }

  &__item:not(:last-child) {
    display: block;
    width: 100%;
    margin-bottom: 12px;
  }

  &__img {
    box-shadow: 0 0 4px 8px var(--color-primary);

    @media (hover: hover) {
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.02);
      }
    }
  }

  &__skeleton {
    position: absolute;
    left: 50%;
    width: 400px;
    transform: translateX(-50%);

    @media (max-width: 768px) {
      width: 100%;
    }
  }
}


.animate-photo {
  opacity: 0;
}

@keyframes photo-masonry {
  0% {
    min-height: 10000px;
  }

  100% {
    min-height: 100vh;
  }
}
</style>
